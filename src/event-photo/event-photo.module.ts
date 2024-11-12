import { Module } from '@nestjs/common';
import { EventPhotoService } from './event-photo.service';
import { EventPhotoController } from './event-photo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventPhoto } from './entities/event-photo.entity';
import { User } from 'src/users/entities/user.entity';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventPhoto, User]),
  EventModule],
  controllers: [EventPhotoController],
  providers: [EventPhotoService],
})
export class EventPhotoModule {}
