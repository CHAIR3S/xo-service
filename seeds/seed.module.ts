
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { TicketStatus } from 'src/ticket-status/entities/ticket-status.entity';
import { HelperPermission } from 'src/helper-permission/entities/helper-permission.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, TicketStatus, HelperPermission]),
    UsersModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}