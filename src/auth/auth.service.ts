import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createDecipheriv, randomBytes, scrypt, verify } from 'crypto';
import { promisify } from 'util';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private userService : UsersService,
        private jwtService: JwtService,

    ) {
    }

    async signIn({email, password}): Promise<{ access_token: string, user:User }> {
        const user = await this.userService.findOneByEmail(email);
    
        if (!user) throw new UnauthorizedException('Password or Email are incorrect');
        
        this.logger.log('Usuario encontrado por email')

        const isMatch = await this.match(user.password, password);
    
        if (!isMatch) throw new UnauthorizedException('Password or Email are incorrect');
    
        this.logger.log('Sesion iniciada correctamente')

        const payload = { sub: user.id, username: user.username, name: user.name, verify: user.isVerified };
    
        return {
          access_token: await this.jwtService.signAsync(payload),
          user: user
        };
    }


    async match(storedPassword: string, suppliedPassword: string) {
        const [ivHex, encryptedPassword] = storedPassword.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedBuffer = Buffer.from(encryptedPassword, 'hex');
        const secret = 'c832di0xie9jc90';
        const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;
    
        const decipher = createDecipheriv('aes-256-ctr', key, iv);
    
        const decryptedText = Buffer.concat([
          decipher.update(encryptedBuffer),
          decipher.final(),
        ]);
    
        return decryptedText.toString() === suppliedPassword;
    }

}
