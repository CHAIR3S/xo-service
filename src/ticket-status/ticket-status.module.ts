import { Module } from '@nestjs/common';
import { TicketStatusService } from './ticket-status.service';
import { TicketStatusController } from './ticket-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketStatus } from './entities/ticket-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketStatus])],
  controllers: [TicketStatusController],
  providers: [TicketStatusService],
})
export class TicketStatusModule {}
