import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from 'src/enum/role.enum';
import { Public } from 'src/decorator/public.decorator';
import { ValidateUserId } from 'src/decorator/validate-user.decorator';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Public()
  @Post()
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    createUserDto.roleId = 2;

    return this.usersService.create(createUserDto);
  }
  
  
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/username/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }


  @ValidateUserId('id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }


  @Patch('role-to-3/:userId')
  async updateUserRole(@Param('userId') userId: number) {
    return await this.usersService.updateUserRoleTo3(userId);
  }

  @ValidateUserId('id')
  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  
  @ValidateUserId('id')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
