import { PartialType } from '@nestjs/mapped-types';
import { CreateEventVisibilityDto } from './create-event-visibility.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateEventVisibilityDto extends PartialType(CreateEventVisibilityDto) {}
