import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // @Post()
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.roleService.create(createRoleDto);
  // }

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const role = this.roleService.findOne(+id);

    if(!role){
      throw new NotFoundException('Role does not exist');
    }

    return role;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.roleService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roleService.remove(+id);
  // }
}
