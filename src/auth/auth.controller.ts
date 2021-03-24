import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AccessTokenInterface } from './accesstoken.interface';

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService
  ) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe)
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe)
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<AccessTokenInterface> {
    return this.authService.signIn(authCredentialsDto);
  }
}
