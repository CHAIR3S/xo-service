import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Put } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from 'src/enum/role.enum';
import { Ticket } from './entities/ticket.entity';
import { Public } from 'src/decorator/public.decorator';
import { ApiBody } from '@nestjs/swagger';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  private readonly logger = new Logger('-- ' + TicketController.name + ' --');


  //
  @Patch('code')
  @ApiBody({ type: UpdateTicketDto })
  updateByCode(@Body() updateTicketDto: UpdateTicketDto) {
    this.logger.log(updateTicketDto)
    return this.ticketService.updateByCode(updateTicketDto);
  }

  @Roles(Role.ADMIN, Role.CREATOR)
  @Post()
  @ApiBody({ type: CreateTicketDto })
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Roles(Role.ADMIN, Role.CREATOR, Role.USER)
  @Post('event/:amount')
  @ApiBody({ type: CreateTicketDto })
  createByEvent(@Param('amount') amount: number, @Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createAll(createTicketDto, amount);
  }

  
  
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Public()
  @Post('user')
  @ApiBody({ schema: { 
    type: 'object', 
    properties: { 
      userId: { type: 'number' }, 
      eventId: { type: 'string' } 
    } 
  }})
  async getByUserId(@Body() {userId, eventId}) {
    return this.ticketService.getByUserId(userId, eventId);
  }


  @Roles(Role.ADMIN, Role.CREATOR)
  @Get('event/:eventId')
  async getAllByEventId(@Param('eventId') eventId: string) {
    return this.ticketService.findAllByEventId(eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }





  @Roles(Role.ADMIN, Role.CREATOR)
  @Patch(':id')
  @ApiBody({ type: UpdateTicketDto })
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  
  @Roles(Role.ADMIN, Role.CREATOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }



  


}
