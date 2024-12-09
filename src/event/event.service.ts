import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { generateUniqueAlphanumericId } from 'src/utils/id.generator.utils';
import { User } from 'src/users/entities/user.entity';
import { lookup } from 'mime-types';
import { EventUser } from 'src/enum/event-user.enum';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Injectable()
export class EventService {

  private readonly logger = new Logger('-- ' + EventService.name + ' --');

  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = new Event();
    event.id = await generateUniqueAlphanumericId(this.eventRepository, 'id');
    event.creator = new User();
    event.creator.id = createEventDto.creatorId;
    event.name = createEventDto.name;
    event.description = createEventDto.description;
    event.date = createEventDto.date;
    event.startTime = createEventDto.startTime;
    event.endTime = createEventDto.endTime;
    event.location = createEventDto.location;
    event.maxGuests = createEventDto.maxGuests;
    event.visibility = { id: createEventDto.visibilityId } as any; 
    event.theme = createEventDto.theme;
    event.cover = Buffer.from(createEventDto.cover, 'base64');
    
    event.ticketPrice = createEventDto.ticketPrice;
    event.allowPhotoUpload = createEventDto.allowPhotoUpload;
    event.securityOptions = createEventDto.securityOptions;
    event.contactInfo = createEventDto.contactInfo;

    return this.eventRepository.save(event);
  }

  async findAll() {
    const events: any[] = await this.eventRepository.find();

    // Procesa los eventos de manera asíncrona
    return await Promise.all(
      events.map(async event => {
        if (event.cover) {
          // const mimeType = lookup('jpg') || 'application/octet-stream'; // Puedes cambiar "png" a lo que corresponda
          event.cover = event.cover.toString('base64');
          // event.cover = `data:${mimeType};base64,${base64}`;
        }
        return event;
      }),
    );
  }

  async findOne(id: string) {
    const event: any = await this.eventRepository.findOne({ where: { id }, relations: ['creator', 'visibility'] });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.cover) {
      event.cover = Buffer.from(event.cover).toString('base64');
    }
    

    return event;
  }


  async findStats(id: string) {
    const event: any = await this.eventRepository.findOne({ where: { id }, relations: ['creator'] });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.cover) {
      event.cover = Buffer.from(event.cover).toString('base64');
    }
    
    const assistants = await this.ticketRepository
    .createQueryBuilder('ticket')
    .innerJoin('ticket.status', 'status') // Unir con la entidad relacionada
    .where('ticket.event_id = :eventId', { eventId: id })
    .andWhere('status.id = :statusId', { statusId: 2 })
    .getCount();




    return {event, assistants};
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    this.logger.log('Update Event', id)
    const event = await this.findOne(id);
    

    event.creator.id = updateEventDto.creatorId;
    event.name = updateEventDto.name ?? event.name;
    event.description = updateEventDto.description ?? event.description;
    event.date = updateEventDto.date ?? event.date;
    event.startTime = updateEventDto.startTime ?? event.startTime;
    event.endTime = updateEventDto.endTime ?? event.endTime;
    event.location = updateEventDto.location ?? event.location;
    event.maxGuests = updateEventDto.maxGuests ?? event.maxGuests;
    event.visibility = updateEventDto.visibilityId ? { id: updateEventDto.visibilityId } as any : event.visibility;
    event.theme = updateEventDto.theme ?? event.theme;
    event.cover = Buffer.from(updateEventDto.cover, 'base64');
    event.ticketPrice = updateEventDto.ticketPrice ?? event.ticketPrice;
    event.allowPhotoUpload = updateEventDto.allowPhotoUpload ?? event.allowPhotoUpload;
    event.securityOptions = updateEventDto.securityOptions ?? event.securityOptions;
    event.contactInfo = updateEventDto.contactInfo ?? event.contactInfo;

    return this.eventRepository.save(event);
  }

  remove(id: string) {
    return this.eventRepository.delete({ id });
  }


  async getRelationUser(userId: number, id: string){
    const event = await this.eventRepository.findOne({where: {id: id}, relations: ['creator']});

    this.logger.log(event);
    this.logger.log(userId)
    this.logger.log(event.creator);

    if(event.creator.id == userId){
      return EventUser.CREATOR.toString();
    }

    const ticket = await this.ticketRepository.findOne({
      where: {
        event: { id: id },
        user: { id: userId },
      },
      relations: ['event', 'user'],
    })

    if(ticket){
      return EventUser.REGISTER.toString();
    }

    return EventUser.UNREGISTER.toString();
  }





  async getPastEventsByCreator(creatorId: number) {
    const events: any[] = await this.eventRepository.createQueryBuilder('event')
      .where('event.creator_id = :creatorId', { creatorId })
      .andWhere("(event.date || ' ' || event.start_time)::timestamp < NOW()")
      .getMany();
  
    if (!Array.isArray(events)) {
      this.logger.error(`getPastEventsByCreator: Expected an array but got: ${typeof events}`, events);
      return [];
    }
  
    return Promise.all(
      events.map(async (event) => {
        if (event.cover) {
          event.cover = event.cover.toString('base64');
        }
        return event;
      }),
    );
  }
  
  async getFutureEventsByCreator(creatorId: number) {
    const events: any[] = await this.eventRepository.createQueryBuilder('event')
      .where('event.creator_id = :creatorId', { creatorId })
      .andWhere("(event.date || ' ' || event.start_time)::timestamp > NOW()")
      .getMany();
  
    if (!Array.isArray(events)) {
      this.logger.error(`getFutureEventsByCreator: Expected an array but got: ${typeof events}`, events);
      return [];
    }
  
    return Promise.all(
      events.map(async (event) => {
        if (event.cover) {
          event.cover = event.cover.toString('base64');
        }
        return event;
      }),
    );
  }
  
  async getPastRegisteredEvents(userId: number) {
    const events: any[] = await this.eventRepository.createQueryBuilder('event')
      .leftJoin('event.tickets', 'ticket')
      .where('ticket.user_id = :userId', { userId })
      .andWhere("(event.date || ' ' || event.start_time)::timestamp < NOW()")
      .getMany();
  
    if (!Array.isArray(events)) {
      this.logger.error(`getPastRegisteredEvents: Expected an array but got: ${typeof events}`, events);
      return [];
    }
  
    return Promise.all(
      events.map(async (event) => {
        if (event.cover) {
          event.cover = event.cover.toString('base64');
        }
        return event;
      }),
    );
  }
  
  async getFutureRegisteredEvents(userId: number) {
    const events: any[] = await this.eventRepository.createQueryBuilder('event')
      .leftJoin('event.tickets', 'ticket')
      .where('ticket.user_id = :userId', { userId })
      .andWhere("(event.date || ' ' || event.start_time)::timestamp > NOW()")
      .getMany();
  
    if (!Array.isArray(events)) {
      this.logger.error(`getFutureRegisteredEvents: Expected an array but got: ${typeof events}`, events);
      return [];
    }
  
    return Promise.all(
      events.map(async (event) => {
        if (event.cover) {
          event.cover = event.cover.toString('base64');
        }
        return event;
      }),
    );
  }
  

}