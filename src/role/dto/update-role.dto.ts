import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateRoleDto extends PartialType(CreateRoleDto) {    

}
