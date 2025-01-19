import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Ticket, User])],
  controllers: [EventController],
  providers: [EventService, UsersService],
  exports: [TypeOrmModule]
})
export class EventModule {}
