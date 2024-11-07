import { Injectable } from '@nestjs/common';
import { CreateEventVisibilityDto } from './dto/create-event-visibility.dto';
import { UpdateEventVisibilityDto } from './dto/update-event-visibility.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventVisibility } from './entities/event-visibility.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventVisibilityService {

  constructor(
    @InjectRepository(EventVisibility) private eventVisibilityRepository: Repository<EventVisibility>
  ){}

  create(createEventVisibilityDto: CreateEventVisibilityDto) {
    const visibility = new EventVisibility();
    visibility.name = createEventVisibilityDto.name;
    return this.eventVisibilityRepository.save(visibility);
  }

  findAll() {
    return this.eventVisibilityRepository.find();
  }

  findOne(id: number) {
    return this.eventVisibilityRepository.findOneBy({id})
  }

  async update(id: number, updateEventVisibilityDto: UpdateEventVisibilityDto) {
    const visibilityById = await this.eventVisibilityRepository.findOneBy({id});
    visibilityById.name = updateEventVisibilityDto.name;
    return this.eventVisibilityRepository.save(visibilityById);
  }

  remove(id: number) {
    return this.eventVisibilityRepository.delete({id});
  }
}
