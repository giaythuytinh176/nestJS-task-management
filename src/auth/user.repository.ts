import {Connection, EntityRepository, Repository} from 'typeorm';
import {User} from './user.entity';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {
    ConflictException,
    InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username: username, password: password} = authCredentialsDto;

        // const user = new User();
        const user = this.create();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            // console.log('save', user);
            await user.save();
        } catch (error) {
            // console.log('error', error);
            if (error.code === '23505') {
                // 23505 duplicate username
                throw new ConflictException('Username already exists.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUsernamePassword(
        authCredentials: AuthCredentialsDto,
    ): Promise<string> {
        const {username: username, password: password} = authCredentials;
        const user = await this.findOne({username: username});

        if (user && (await user.validatePassword(password))) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
