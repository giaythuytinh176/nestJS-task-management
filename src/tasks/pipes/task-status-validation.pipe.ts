import {PipeTransform, BadRequestException, ArgumentMetadata} from '@nestjs/common';
import {TaskStatus} from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    transform(value: any, metadata: ArgumentMetadata) {
        console.log('TaskStatusValidationPipe: value ', value);
        console.log('TaskStatusValidationPipe: metadata ', metadata);
        value = value.toUpperCase();
        console.log('Request ... TaskStatusValidationPipe');
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status`);
        }

        return value;
    }

    private isStatusValid(status: any) {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}
