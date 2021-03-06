import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {InjectRepository} from '@nestjs/typeorm';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {JwtService} from '@nestjs/jwt';
import {JwtPayloadInterface} from './interface/jwt-payload.interface';
import {AccessTokenInterface} from './interface/accesstoken.interface';
import { Connection } from 'typeorm';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private connection: Connection,
    ) {
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(
        authCredentialsDto: AuthCredentialsDto,
    ): Promise<AccessTokenInterface> {
        const user = await this.userRepository.validateUsernamePassword(
            authCredentialsDto,
        );
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const userInfo = await this.userRepository.findOne({username: user});
        const payload: JwtPayloadInterface = {
            username: user,
            user_id: userInfo.id,
        };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(
            `Generated JWT Token with Payload ${JSON.stringify(payload)}`,
        );
        // console.log('user', await this.jwtService.decode(accessToken));
        return {accessToken: accessToken};
    }
}
