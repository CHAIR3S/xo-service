import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Public } from 'src/decorator/public.decorator';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from 'src/enum/role.enum';
import { ApiBody } from '@nestjs/swagger';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Roles(Role.ADMIN, Role.CREATOR, Role.USER)
  @ApiBody({ type: CreateEventDto })
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Public()
  @Get()
  findAll(){
    return this.eventService.findAll();
  }

  @Roles(Role.ADMIN, Role.CREATOR, Role.USER)
  @Post('event-user')
  @ApiBody({ schema: { 
    type: 'object', 
    properties: { 
      userId: { type: 'number' }, 
      eventId: { type: 'string' } 
    } 
  }})
  findUserRelation(@Body() { userId, eventId }: { userId: number; eventId: string }) {
    return this.eventService.getRelationUser(userId, eventId);
  }


  @Get('creator/:creatorId/past')
  getPastEventsByCreator(@Param('creatorId') creatorId: number) {
    return this.eventService.getPastEventsByCreator(creatorId);
  }

  @Get('creator/:creatorId/future')
  getFutureEventsByCreator(@Param('creatorId') creatorId: number) {
    return this.eventService.getFutureEventsByCreator(creatorId);
  }

  @Get('user/:userId/registered/past')
  getPastRegisteredEvents(@Param('userId') userId: number) {
    return this.eventService.getPastRegisteredEvents(userId);
  }

  @Get('user/:userId/registered/future')
  getFutureRegisteredEvents(@Param('userId') userId: number) {
    return this.eventService.getFutureRegisteredEvents(userId);
  }

  @Public()
  @Get('stats/:id')
  findOneStats(@Param('id') id: string) {
    return this.eventService.findStats(id);
  }


  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.CREATOR)
  @Patch(':id')
  @ApiBody({ type: UpdateEventDto })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Roles(Role.ADMIN, Role.CREATOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
