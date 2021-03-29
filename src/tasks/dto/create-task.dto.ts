import {IsAlphanumeric, IsNotEmpty, IsString} from 'class-validator';

export class CreateTaskDTO {
    @IsNotEmpty()
        // @IsAlphanumeric()
    title: string;

    @IsNotEmpty()
        // @IsAlphanumeric()
    description: string;
}
