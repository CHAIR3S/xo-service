import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ){}

  create(createRoleDto: CreateRoleDto) {
    const role = new Role();
    role.name = createRoleDto.name;
    return this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOneBy({id});
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const roleById = await this.roleRepository.findOneBy({id});
    roleById.name = updateRoleDto.name;
    return this.roleRepository.save(roleById)
  }

  remove(id: number) {
    return this.roleRepository.delete({id});
  }
  
}
