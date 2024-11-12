import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createDecipheriv, randomBytes, scrypt, verify } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private userService : UsersService,
        private jwtService: JwtService,

    ) {
    }

    async signIn({email, password}): Promise<{ access_token: string }> {

        const user = await this.userService.findOneByEmail(email);

        if(!user)
            throw new UnauthorizedException('Password or Email are incorrect');

        // let isMatch = false;
        const isMatch = await this.match(user.password, password);

        if(!isMatch)
            throw new UnauthorizedException('Password or Email are incorrect');

        const payload = { sub: user.id, username: user.username, name: user.name, verify: user.isVerified};

        return {
        access_token: await this.jwtService.signAsync(payload),
        };
    }


    async match(encrypted, unencrypted){
        const iv = randomBytes(16);
        const secret = 'c832di0xie9jc90';
        const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;
        // const cipher = createCipheriv('aes-256-ctr', key, iv);

        const decipher = createDecipheriv('aes-256-ctr', key, iv);

        const decryptedText = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);


        this.logger.log(decryptedText.toString())

        return (decryptedText.toString() == unencrypted);
    }

}
