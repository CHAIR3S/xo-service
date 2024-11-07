import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {

  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = new Event();
    event.name = createEventDto.name;
    event.description = createEventDto.description;
    event.date = createEventDto.date;
    event.startTime = createEventDto.startTime;
    event.endTime = createEventDto.endTime;
    event.location = createEventDto.location;
    event.maxGuests = createEventDto.maxGuests;
    event.visibility = { id: createEventDto.visibilityId } as any; 
    event.theme = createEventDto.theme;
    event.cover = createEventDto.cover;
    event.ticketPrice = createEventDto.ticketPrice;
    event.allowPhotoUpload = createEventDto.allowPhotoUpload;
    event.securityOptions = createEventDto.securityOptions;
    event.contactInfo = createEventDto.contactInfo;

    return this.eventRepository.save(event);
  }

  findAll() {
    return this.eventRepository.find();
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);
    event.name = updateEventDto.name ?? event.name;
    event.description = updateEventDto.description ?? event.description;
    event.date = updateEventDto.date ?? event.date;
    event.startTime = updateEventDto.startTime ?? event.startTime;
    event.endTime = updateEventDto.endTime ?? event.endTime;
    event.location = updateEventDto.location ?? event.location;
    event.maxGuests = updateEventDto.maxGuests ?? event.maxGuests;
    event.visibility = updateEventDto.visibilityId ? { id: updateEventDto.visibilityId } as any : event.visibility;
    event.theme = updateEventDto.theme ?? event.theme;
    event.cover = updateEventDto.cover ?? event.cover;
    event.ticketPrice = updateEventDto.ticketPrice ?? event.ticketPrice;
    event.allowPhotoUpload = updateEventDto.allowPhotoUpload ?? event.allowPhotoUpload;
    event.securityOptions = updateEventDto.securityOptions ?? event.securityOptions;
    event.contactInfo = updateEventDto.contactInfo ?? event.contactInfo;

    return this.eventRepository.save(event);
  }

  remove(id: string) {
    return this.eventRepository.delete({ id });
  }
}