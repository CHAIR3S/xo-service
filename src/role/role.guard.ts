import { Injectable, CanActivate, ExecutionContext, Logger, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorator/role.decorator';
import { Role } from 'src/enum/role.enum';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService, 
  ) {}

  
  private readonly logger = new Logger(RolesGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if(user){

      this.logger.log('Find roles by user {}:', user.sub)

      const userById: User = await this.usersService.findOne(user.sub);

      this.logger.log('ROLE GUARD >>>>');
      // this.logger.log(userById);
  
      return requiredRoles.some((role) => userById.role.name?.includes(role));
    }

    if(!user){
      throw new NotFoundException('User does not exist');
    }
    
    return false;
  }
}