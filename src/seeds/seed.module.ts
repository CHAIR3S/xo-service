
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { TicketStatus } from 'src/ticket-status/entities/ticket-status.entity';
import { HelperPermission } from 'src/helper-permission/entities/helper-permission.entity';
import { UsersModule } from 'src/users/users.module';
import { EventVisibility } from 'src/event-visibility/entities/event-visibility.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, TicketStatus, HelperPermission, EventVisibility]),
    UsersModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}