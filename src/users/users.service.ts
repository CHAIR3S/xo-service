import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ){

  }

  async create(createUserDto: CreateUserDto) {
    const role = new Role();
    const user = new User();
    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    // user.password = createUserDto.password;
    user.profilePicture = createUserDto.profilePicture;
    role.id = createUserDto.roleId;
    user.role = role;
    user.verificationCode = createUserDto.verificationCode;
    user.isVerified = createUserDto.isVerified;

    
    const { encryptedText, iv } = await this.encrypt(createUserDto.password);
    user.password = `${iv.toString('hex')}:${encryptedText}`;

  
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['role'],
    });
  }

  findOneByEmail(email: string){
    return this.userRepository.findOneBy({email});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userById = await this.userRepository.findOneBy({id});
    const role = new Role();

    userById.name = updateUserDto.name;
    userById.username = updateUserDto.username;
    userById.email = updateUserDto.email;
    

    const { encryptedText, iv } = await this.encrypt(updateUserDto.password);
    userById.password = `${iv.toString('hex')}:${encryptedText}`;

    userById.profilePicture = updateUserDto.profilePicture;
    role.id = updateUserDto.roleId;
    userById.role = role;

    userById.verificationCode = updateUserDto.verificationCode;
    userById.isVerified = updateUserDto.isVerified;
    return this.userRepository.save(userById);
  }

  remove(id: number) {
    return this.userRepository.delete({id})
  }


  async encrypt(password: string){
    const iv = randomBytes(16);
    const secret = 'c832di0xie9jc90';
    const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedText = Buffer.concat([
      cipher.update(password),
      cipher.final(),
    ]);

    return { encryptedText: encryptedText.toString('hex'), iv };
  }
}
