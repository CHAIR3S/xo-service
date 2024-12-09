import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  private readonly logger = new Logger('-- ' + TicketService.name + ' --');


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
    const generatedCodes = new Set<string>();
  
    for (let i = 0; i < amount; i++) {
      const ticket = new Ticket();
      ticket.event = new Event();
      ticket.event.id = createTicketDto.eventId;
      ticket.status = new TicketStatus();
      ticket.status.id = 1; // Status CREATED
  
      let uniqueCode: string;
      do {
        uniqueCode = await generateUniqueLengthCodeForEvent(
          createTicketDto.eventId,
          this.ticketRepository,
          5
        );
      } while (generatedCodes.has(uniqueCode));
  
      generatedCodes.add(uniqueCode);
      ticket.code = uniqueCode;
      tickets.push(ticket);
    }
  
    // Inserciones en lotes
    const batchSize = 10; // Ajusta según el límite de la base de datos
    for (let i = 0; i < tickets.length; i += batchSize) {
      const batch = tickets.slice(i, i + batchSize);
      await this.ticketRepository.save(batch);
    }
  
    return { success: true, inserted: tickets.length };
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
    const ticket = await this.ticketRepository.findOneBy({id});

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
    const ticket = await this.ticketRepository.findOneBy({id});
    return this.ticketRepository.delete(ticket);
  }

  getByUserId(userId: number, eventId: string){
    
    return this.ticketRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
      relations: ['event', 'user'],
    });

  }

  async updateByCode(ticket: UpdateTicketDto){

    this.logger.log(ticket);


    const find = await this.ticketRepository.findOne({
      where: {
        event: {id: ticket.eventId},
        code: ticket.code,
    },
      relations: ['user']
      
    })

    this.logger.log(find);
    find.user = new User();
    find.user.id = ticket.userId;
    find.status = new TicketStatus();
    find.status.id = ticket.statusId; 
    

    return this.ticketRepository.save(find);
  }
}
