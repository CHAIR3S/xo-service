import { Module } from '@nestjs/common';
import { EventVisibilityService } from './event-visibility.service';
import { EventVisibilityController } from './event-visibility.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventVisibility } from './entities/event-visibility.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventVisibility])],
  controllers: [EventVisibilityController],
  providers: [EventVisibilityService],
})
export class EventVisibilityModule {}
