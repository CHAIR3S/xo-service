
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorator/public.decorator';
import { Reflector } from '@nestjs/core';
import { log } from 'console';
import { config } from 'config';
import { VALIDATE_USER_ID_KEY } from 'src/decorator/validate-user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  private readonly logger = new Logger('-- ' + AuthGuard.name + ' --');


  async canActivate(context: ExecutionContext): Promise<boolean> {

    if(!config.authEnabled){
      this.logger.debug('No authentication')
      return true;
    }


    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      this.logger.debug('Public endpoint')
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );

      request['user'] = payload;


      const userIdFromToken = payload.sub; // ID del usuario autenticado
      const userRole = payload.role; // Rol del usuario

      // 3. Verificar si hay que validar el userId del request
      const validateUserIdField = this.reflector.get<string>(
        VALIDATE_USER_ID_KEY,
        context.getHandler(),
      );

      if (validateUserIdField) {
        // Extraer el userId desde el parámetro indicado en el decorador
        const userIdFromRequest =
          request.params[validateUserIdField] ||
          request.body[validateUserIdField] ||
          request.query[validateUserIdField];

        if (!userIdFromRequest) {
          throw new ForbiddenException(`Missing userId field: ${validateUserIdField}`);
        }


        this.logger.debug('userIdFromToken : {}', userIdFromToken)
        this.logger.debug('userIdFromRequest : {}', userIdFromRequest)
        this.logger.debug('userRole : {}', payload)


        // 4. Permitir acceso solo si el userId coincide o si es admin
        if (userRole !== 'ADMIN' && userIdFromToken != userIdFromRequest) {
          this.logger.warn(`Unauthorized access attempt: User ${userIdFromToken} tried to access ${userIdFromRequest}`);
          throw new ForbiddenException('You are not allowed to access this resource');
        }
      }
      
      this.logger.log('AUTHGUARD >>>')
      // this.logger.log(request['user'])

      return true;
      
    } catch(e) {
      this.logger.log(token)
      this.logger.error(e)
      this.logger.error('Not Authorized');
      throw new UnauthorizedException();
    }


  }

  

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
