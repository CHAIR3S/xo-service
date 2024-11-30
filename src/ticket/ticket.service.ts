import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Event } from 'src/event/entities/event.entity';
import { TicketStatus } from 'src/ticket-status/entities/ticket-status.entity';
import { User } from 'src/users/entities/user.entity';
import { generateUniqueLengthCodeForEvent } from 'src/utils/id.generator.utils';

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

    ticket.code = await generateUniqueLengthCodeForEvent(createTicketDto.eventId, this.ticketRepository, 5);
    return this.ticketRepository.save(ticket);
  }


  async createAll(createTicketDto: CreateTicketDto, amount: number) {
    const tickets: Ticket[] = [];
    const generatedCodes = new Set<string>(); // Usamos un conjunto para almacenar códigos únicos
  
    for (let i = 0; i < amount; i++) {
      const ticket = new Ticket();
      ticket.event = new Event();
      ticket.event.id = createTicketDto.eventId;
      ticket.status = new TicketStatus();
      ticket.status.id = 1; // Status CREATED
  
      let uniqueCode: string;
      do {
        // Generar un código único para el evento
        uniqueCode = await generateUniqueLengthCodeForEvent(
          createTicketDto.eventId,
          this.ticketRepository,
          5,
        );
      } while (generatedCodes.has(uniqueCode)); // Verificar que no esté en el conjunto local
  
      // Agregar el código único al conjunto
      generatedCodes.add(uniqueCode);
  
      ticket.code = uniqueCode; // Asignar el código al ticket
      tickets.push(ticket);
    }
  
    return this.ticketRepository.save(tickets);
  }
  


  findAll() {
    return this.ticketRepository.find({ relations: ['user', 'status'] });
  }

  findAllByEventId(eventId: string) {
    return this.ticketRepository.find({
      where: { event: { id: eventId } },
      relations: ['status', 'user'],
    });
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
