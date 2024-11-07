import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Helper } from './entities/helper.entity';
import { CreateHelperDto } from './dto/create-helper.dto';
import { UpdateHelperDto } from './dto/update-helper.dto';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import { HelperPermission } from 'src/helper-permission/entities/helper-permission.entity';

@Injectable()
export class HelperService {
  constructor(
    @InjectRepository(Helper)
    private readonly helperRepository: Repository<Helper>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(HelperPermission)
    private readonly helperPermissionRepository: Repository<HelperPermission>,
  ) {}

  async create(createHelperDto: CreateHelperDto): Promise<Helper> {
    const helper = new Helper();

    helper.event = await this.eventRepository.findOneBy({ id: createHelperDto.eventId });
    if (!helper.event) {
      throw new NotFoundException(`Event with ID ${createHelperDto.eventId} not found`);
    }

    helper.user = await this.userRepository.findOneBy({ id: createHelperDto.userId });
    if (!helper.user) {
      throw new NotFoundException(`User with ID ${createHelperDto.userId} not found`);
    }

    helper.permission = await this.helperPermissionRepository.findOneBy({ id: createHelperDto.permissionId });
    if (!helper.permission) {
      throw new NotFoundException(`Permission with ID ${createHelperDto.permissionId} not found`);
    }

    return this.helperRepository.save(helper);
  }

  findAll(): Promise<Helper[]> {
    return this.helperRepository.find({ relations: ['event', 'user', 'permission'] });
  }

  async findOne(id: number): Promise<Helper> {
    const helper = await this.helperRepository.findOne({ where: { id }, relations: ['event', 'user', 'permission'] });
    if (!helper) {
      throw new NotFoundException(`Helper with ID ${id} not found`);
    }
    return helper;
  }

  async update(id: number, updateHelperDto: UpdateHelperDto): Promise<Helper> {
    const helper = await this.findOne(id);

    if (updateHelperDto.eventId) {
      helper.event = await this.eventRepository.findOneBy({ id: updateHelperDto.eventId });
      if (!helper.event) {
        throw new NotFoundException(`Event with ID ${updateHelperDto.eventId} not found`);
      }
    }

    if (updateHelperDto.userId) {
      helper.user = await this.userRepository.findOneBy({ id: updateHelperDto.userId });
      if (!helper.user) {
        throw new NotFoundException(`User with ID ${updateHelperDto.userId} not found`);
      }
    }

    if (updateHelperDto.permissionId) {
      helper.permission = await this.helperPermissionRepository.findOneBy({ id: updateHelperDto.permissionId });
      if (!helper.permission) {
        throw new NotFoundException(`Permission with ID ${updateHelperDto.permissionId} not found`);
      }
    }

    return this.helperRepository.save(helper);
  }

  async remove(id: number): Promise<void> {
    const helper = await this.findOne(id);
    await this.helperRepository.remove(helper);
  }
}
