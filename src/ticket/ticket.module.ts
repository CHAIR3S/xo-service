import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket } from './entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketStatus } from 'src/ticket-status/entities/ticket-status.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Event, TicketStatus]),
  UsersModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
