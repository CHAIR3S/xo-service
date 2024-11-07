import { Injectable } from '@nestjs/common';
import { CreateHelperPermissionDto } from './dto/create-helper-permission.dto';
import { UpdateHelperPermissionDto } from './dto/update-helper-permission.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperPermission } from './entities/helper-permission.entity';

@Injectable()
export class HelperPermissionService {

  constructor(
    @InjectRepository(HelperPermission) 
    private helperPermissionRepository: Repository<HelperPermission>
  ){}

  create(createHelperPermissionDto: CreateHelperPermissionDto) {
    const helper = new HelperPermission();
    helper.name = createHelperPermissionDto.name;
    return this.helperPermissionRepository.save(helper);
  }

  findAll() {
    return this.helperPermissionRepository.find();
  }

  findOne(id: number) {
    return this.helperPermissionRepository.findOneBy({id});
  }

  async update(id: number, updateHelperPermissionDto: UpdateHelperPermissionDto) {
    const helperByid = await this.helperPermissionRepository.findOneBy({id});
    helperByid.name = updateHelperPermissionDto.name;
    return this.helperPermissionRepository.save(helperByid);
  }

  remove(id: number) {
    return this.helperPermissionRepository.delete({id});
  }
}
