import {EntityRepository, Repository} from 'typeorm';
import {Task} from './task.entity';
import {CreateTaskDTO} from './dto/create-task.dto';
import {TaskStatus} from './task-status.enum';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {User} from '../auth/user.entity';
import {InternalServerErrorException, Logger} from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        
        const {status: status, search: search} = filterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', {userId: user.id});

        if (status) {
            query.andWhere('task.status = :status', {status: status});
        }

        if (search) {
            query.andWhere(
                // Sử dụng ( ) trong câu sql duoi để dùng đồng thời 2 andWhere
                '(task.title LIKE :search OR task.description LIKE :search)',
                {search: `%${search}%`},
            );
        }
        // console.log('query', query.getQuery());
        try {
            return await query.getMany();
        } catch (e) {
            this.logger.error(
                `Failed to get tasks for user "${user.username}", DTO: ${JSON.stringify(
                    filterDto,
                )}`,
                e.stack,
            );
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        const {title: title, description: description} = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.userId = user.id;
        // task.user = user;
        // console.log('task.user', task.user);
        // console.log('task.userId', task.userId);
        // delete task.user;
        try {
            await task.save();
        } catch (e) {
            this.logger.error(
                `Failed to create a task for user "${
                    user.username
                }. Data ${JSON.stringify(createTaskDto)}`,
                e.stack,
            );
            throw new InternalServerErrorException();
        }
        return task;
    }
}
