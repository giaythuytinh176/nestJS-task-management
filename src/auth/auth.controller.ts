import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

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
  ): Promise<string> {
    return this.authService.signIn(authCredentialsDto);
  }
}
