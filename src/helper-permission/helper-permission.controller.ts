import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { HelperPermissionService } from './helper-permission.service';
import { CreateHelperPermissionDto } from './dto/create-helper-permission.dto';
import { UpdateHelperPermissionDto } from './dto/update-helper-permission.dto';

@Controller('helper-permission')
export class HelperPermissionController {
  constructor(private readonly helperPermissionService: HelperPermissionService) {}

  // @Post()
  // create(@Body() createHelperPermissionDto: CreateHelperPermissionDto) {
  //   return this.helperPermissionService.create(createHelperPermissionDto);
  // }

  @Get()
  findAll() {
    return this.helperPermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const permission = this.helperPermissionService.findOne(+id);
    if(!permission){
      throw new NotFoundException('Visibility does not exist');
    }
    return permission;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateHelperPermissionDto: UpdateHelperPermissionDto) {
  //   return this.helperPermissionService.update(+id, updateHelperPermissionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.helperPermissionService.remove(+id);
  // }
}
