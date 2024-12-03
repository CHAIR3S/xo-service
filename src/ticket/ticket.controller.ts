import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from 'src/enum/role.enum';
import { Ticket } from './entities/ticket.entity';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  private readonly logger = new Logger('-- ' + TicketController.name + ' --');


  @Roles(Role.ADMIN, Role.CREATOR)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Roles(Role.ADMIN, Role.CREATOR)
  @Post('event/:amount')
  createByEvent(@Param('amount') amount: number, @Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createAll(createTicketDto, amount);
  }

  
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }


  @Patch('code')
  updateByCode(@Body() updateTicketDto: UpdateTicketDto) {
    // this.logger.log(updateTicketDto)
    return this.ticketService.updateByCode(updateTicketDto);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }

  // @Roles(Role.ADMIN, Role.CREATOR)
  // @Get('event/:eventId')
  // async getAllByEventId(@Param('eventId') eventId: string): Promise<Ticket[]> {
  //   // return this.ticketService.findAllByEventId(eventId);
  // }

  


}
