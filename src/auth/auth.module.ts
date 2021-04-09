import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserRepository} from './user.repository';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {JwtStrategy} from './jwt.strategy';
import * as config from 'config';
import { UserSubscriber } from 'src/subscriber/user.subscriber';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';



const jwtConfig = config.get('jwt');

const throttlerGuard = {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
};  

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || jwtConfig.secret,
            signOptions: {
                expiresIn: jwtConfig.expiresIn,
            },
        }),
        TypeOrmModule.forFeature([UserRepository]),
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        AuthService,
        JwtStrategy,
        UserSubscriber,
        throttlerGuard,
    ],
    exports: [
        JwtStrategy,
        PassportModule,
    ],
})
export class AuthModule {
}
