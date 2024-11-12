import { PartialType } from '@nestjs/swagger';
import { CreateEventPhotoDto } from './create-event-photo.dto';

export class UpdateEventPhotoDto extends PartialType(CreateEventPhotoDto) {}
