import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialDTO } from './dto/credential-dto';
import { Public } from 'src/decorator/public.decorator';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Public()
    @Post('/login')
    @ApiBody({ type: CredentialDTO })
    login(@Body() credentialDto: CredentialDTO){
        return this.authService.signIn(credentialDto);
    }
}
