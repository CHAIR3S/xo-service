import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventPhotoService } from './event-photo.service';
import { CreateEventPhotoDto } from './dto/create-event-photo.dto';
import { UpdateEventPhotoDto } from './dto/update-event-photo.dto';

@Controller('event-photo')
export class EventPhotoController {
  constructor(private readonly eventPhotoService: EventPhotoService) {}

  @Post()
  create(@Body() createEventPhotoDto: CreateEventPhotoDto) {
    return this.eventPhotoService.create(createEventPhotoDto);
  }

  @Get()
  findAll() {
    return this.eventPhotoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventPhotoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventPhotoDto: UpdateEventPhotoDto) {
    return this.eventPhotoService.update(+id, updateEventPhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventPhotoService.remove(+id);
  }
}
