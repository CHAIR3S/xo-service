import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { EventVisibilityService } from './event-visibility.service';
import { CreateEventVisibilityDto } from './dto/create-event-visibility.dto';
import { UpdateEventVisibilityDto } from './dto/update-event-visibility.dto';

@Controller('event-visibility')
export class EventVisibilityController {
  constructor(private readonly eventVisibilityService: EventVisibilityService) {}

  // @Post()
  // create(@Body() createEventVisibilityDto: CreateEventVisibilityDto) {
  //   return this.eventVisibilityService.create(createEventVisibilityDto);
  // }

  @Get()
  findAll() {
    return this.eventVisibilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const visibility = this.eventVisibilityService.findOne(+id);
    if(!visibility){
      throw new NotFoundException('Visibility does not exist');
    }

    return visibility
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventVisibilityDto: UpdateEventVisibilityDto) {
  //   return this.eventVisibilityService.update(+id, updateEventVisibilityDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventVisibilityService.remove(+id);
  // }
}
