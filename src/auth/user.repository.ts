import {Connection, EntityRepository, getConnection, Repository} from 'typeorm';
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

        const user = new User();
        user.username = authCredentialsDto.username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(authCredentialsDto.password, user.salt);

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        // establish real database connection using our new query runner
        await queryRunner.connect();

        // lets now open a new transaction:
        await queryRunner.startTransaction();

        try {
            // execute some operations on this transaction:
            await queryRunner.manager.save(User, user);

            // commit transaction now:
            await queryRunner.commitTransaction();
      
            // return user;
          } catch (err) {
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
            if (err.code === '23505') {
                // 23505 duplicate username
                throw new ConflictException('Username already exists.');
            } else {
                throw new InternalServerErrorException();
            }

          } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
          }

    }

    async signUp_(authCredentialsDto: AuthCredentialsDto): Promise<void> {
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
