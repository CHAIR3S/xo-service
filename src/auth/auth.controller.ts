import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialDTO } from './dto/credential-dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Post('/login')
    login(@Body() credentialDto: CredentialDTO){
        return this.authService.signIn(credentialDto);
    }
}
