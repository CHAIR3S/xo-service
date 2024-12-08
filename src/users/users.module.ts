import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/role/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/role/entities/role.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Event])],
  controllers: [UsersController],
  providers: [
    UsersService,
  ],
  exports: [TypeOrmModule, UsersService]
})
export class UsersModule {}
