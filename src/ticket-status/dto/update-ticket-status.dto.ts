import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketStatusDto } from './create-ticket-status.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateTicketStatusDto extends PartialType(CreateTicketStatusDto) {}
