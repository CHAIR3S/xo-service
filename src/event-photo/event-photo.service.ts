import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventPhoto } from './entities/event-photo.entity';
import { CreateEventPhotoDto } from './dto/create-event-photo.dto';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdateEventPhotoDto } from './dto/update-event-photo.dto';

@Injectable()
export class EventPhotoService {
  constructor(
    @InjectRepository(EventPhoto)
    private readonly eventPhotoRepository: Repository<EventPhoto>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createEventPhotoDto: CreateEventPhotoDto): Promise<EventPhoto> {
    const eventPhoto = new EventPhoto();

    eventPhoto.event = await this.eventRepository.findOneBy({ id: createEventPhotoDto.eventId });
    if (!eventPhoto.event) {
      throw new NotFoundException(`Event with ID ${createEventPhotoDto.eventId} not found`);
    }

    eventPhoto.uploadedBy = await this.userRepository.findOneBy({ id: createEventPhotoDto.uploadedBy });
    if (!eventPhoto.uploadedBy) {
      throw new NotFoundException(`User with ID ${createEventPhotoDto.uploadedBy} not found`);
    }

    eventPhoto.photo = Buffer.from(createEventPhotoDto.photo, 'base64');

    return this.eventPhotoRepository.save(eventPhoto);
  }

  findAll(): Promise<EventPhoto[]> {
    return this.eventPhotoRepository.find({ relations: ['event', 'uploadedBy'] });
  }

  async findOne(id: number): Promise<EventPhoto> {
    const eventPhoto = await this.eventPhotoRepository.findOne({ where: { id }, relations: ['event', 'uploadedBy'] });
    if (!eventPhoto) {
      throw new NotFoundException(`EventPhoto with ID ${id} not found`);
    }
    return eventPhoto;
  }

  async update(id: number, updateEventPhotoDto: UpdateEventPhotoDto): Promise<EventPhoto> {
    const eventPhoto = await this.findOne(id);

    // Actualizar event si se proporciona
    if (updateEventPhotoDto.eventId) {
        eventPhoto.event = await this.eventRepository.findOneBy({ id: updateEventPhotoDto.eventId });
        if (!eventPhoto.event) {
            throw new NotFoundException(`Event with ID ${updateEventPhotoDto.eventId} not found`);
        }
    }

    // Actualizar uploadedBy si se proporciona
    if (updateEventPhotoDto.uploadedBy) {
        eventPhoto.uploadedBy = await this.userRepository.findOneBy({ id: updateEventPhotoDto.uploadedBy });
        if (!eventPhoto.uploadedBy) {
            throw new NotFoundException(`User with ID ${updateEventPhotoDto.uploadedBy} not found`);
        }
    }

    // Convertir photo de base64 a Buffer si se proporciona
    if (updateEventPhotoDto.photo) {
        eventPhoto.photo = Buffer.from(updateEventPhotoDto.photo, 'base64');
    }

    return this.eventPhotoRepository.save(eventPhoto);
  }


  async remove(id: number): Promise<void> {
    const eventPhoto = await this.findOne(id);
    await this.eventPhotoRepository.remove(eventPhoto);
  }
}
