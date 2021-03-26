import {
    MinLength,
    MaxLength,
    IsString,
    Matches,
} from 'class-validator';

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4, {
        message:
            'Username is too short. Minimal length is $constraint1 characters, but actual is $value',
    })
    @MaxLength(22, {
        message:
            'Username is too long. Maximal length is $constraint1 characters, but actual is $value',
    })
    username: string;

    @IsString()
    @MinLength(6, {
        message:
            'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
    })
    @MaxLength(22, {
        message:
            'Password is too long. Maximal length is $constraint1 characters, but actual is $value',
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'},)
    password: string;
}
