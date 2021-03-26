import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {AuthService} from './auth.service';
import {AccessTokenInterface} from './accesstoken.interface';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from './get-user.decorator';
import {User} from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('/signup')
    signUp(
        @Body(ValidationPipe)
            authCredentialsDto: AuthCredentialsDto,
    ): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body(ValidationPipe)
            authCredentialsDto: AuthCredentialsDto,
    ): Promise<AccessTokenInterface> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        // console.log('user', user);
        return user;
    }
}
