import { PartialType } from '@nestjs/mapped-types';
import { CreateHelperPermissionDto } from './create-helper-permission.dto';

export class UpdateHelperPermissionDto extends PartialType(CreateHelperPermissionDto) {}
