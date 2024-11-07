import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Event } from 'src/event/entities/event.entity';
import { TicketStatus } from 'src/ticket-status/entities/ticket-status.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TicketService {

  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(TicketStatus) private ticketStatusRepository: Repository<TicketStatus>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const ticket = new Ticket();
    ticket.code = createTicketDto.code;

    ticket.event = await this.eventRepository.findOneBy({ id: createTicketDto.eventId });
    if (!ticket.event) {
      throw new NotFoundException(`Event with ID ${createTicketDto.eventId} not found`);
    }

    ticket.user = await this.userRepository.findOneBy({ id: createTicketDto.userId });
    if (!ticket.user) {
      throw new NotFoundException(`User with ID ${createTicketDto.userId} not found`);
    }

    if (createTicketDto.statusId) {
      ticket.status = await this.ticketStatusRepository.findOneBy({ id: createTicketDto.statusId });
      if (!ticket.status) {
        throw new NotFoundException(`Status with ID ${createTicketDto.statusId} not found`);
      }
    }

    return this.ticketRepository.save(ticket);
  }

  findAll() {
    return this.ticketRepository.find({ relations: ['event', 'user', 'status'] });
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id }, relations: ['event', 'user', 'status'] });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.findOne(id);

    ticket.code = updateTicketDto.code ?? ticket.code;

    if (updateTicketDto.eventId) {
      ticket.event = await this.eventRepository.findOneBy({ id: updateTicketDto.eventId });
      if (!ticket.event) {
        throw new NotFoundException(`Event with ID ${updateTicketDto.eventId} not found`);
      }
    }

    if (updateTicketDto.userId) {
      ticket.user = await this.userRepository.findOneBy({ id: updateTicketDto.userId });
      if (!ticket.user) {
        throw new NotFoundException(`User with ID ${updateTicketDto.userId} not found`);
      }
    }

    if (updateTicketDto.statusId) {
      ticket.status = await this.ticketStatusRepository.findOneBy({ id: updateTicketDto.statusId });
      if (!ticket.status) {
        throw new NotFoundException(`Status with ID ${updateTicketDto.statusId} not found`);
      }
    }

    return this.ticketRepository.save(ticket);
  }

  async remove(id: number) {
    const ticket = await this.findOne(id);
    return this.ticketRepository.remove(ticket);
  }
}
