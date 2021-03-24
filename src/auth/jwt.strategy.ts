import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'TamLe176',
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<User> { // Ham nay se tu dong check validate accessToken gui len
    const { username: username, user_id: user_id } = payload;
    const user = this.userRepository.findOne({
      username: username,
      id: user_id,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
