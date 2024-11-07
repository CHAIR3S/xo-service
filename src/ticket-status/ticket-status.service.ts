import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketStatusDto } from './dto/create-ticket-status.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketStatus } from './entities/ticket-status.entity';

@Injectable()
export class TicketStatusService {

  constructor(@InjectRepository(TicketStatus) private ticketStatusRepository: Repository<TicketStatus>){}

  create(createTicketStatusDto: CreateTicketStatusDto) {
    const ticketStatus = new TicketStatus();
    ticketStatus.name = createTicketStatusDto.name;
    return this.ticketStatusRepository.save(ticketStatus);
  }

  findAll() {
    return this.ticketStatusRepository.find();
  }

  findOne(id: number) {
    return this.ticketStatusRepository.findOneBy({id});
  }

  async update(id: number, updateTicketStatusDto: UpdateTicketStatusDto) {
    const status = await this.ticketStatusRepository.findOneBy({id});
    status.name = updateTicketStatusDto.name;
    return this.ticketStatusRepository.save(status);
  }

  remove(id: number) {
    return this.ticketStatusRepository.delete({id})
  }
}
