import {
    Body,
    CacheInterceptor,
    CACHE_MANAGER,
    Controller,
    Delete,
    Get,
    Inject,
    Ip,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseFilters,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {CreateTaskDTO} from './dto/create-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {TaskStatusValidationPipe} from './pipes/task-status-validation.pipe';
import {Task} from './task.entity';
import {DeleteResult} from 'typeorm';
import {Request} from 'express';
import {TaskStatus} from './task-status.enum';
 import {AuthGuard} from '@nestjs/passport';
import {GetUser} from '../auth/get-user.decorator';
import {User} from '../auth/user.entity';
import { HttpExceptionFilter } from '../ExceptionFilters/http-exception.filter';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { ErrorsInterceptor } from 'src/interceptors/errors.interceptor';
import { TimeoutInterceptor } from 'src/interceptors/timeout.interceptor';
//import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('tasks')
@UseGuards(AuthGuard())
// load HttpExceptionFilter
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(TransformInterceptor)

// @UseInterceptors(ErrorsInterceptor)
// @UseFilters(HttpExceptionFilter)
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(
        private tasksService: TasksService,
        // @Inject(CACHE_MANAGER) private cacheManager: Cache
        ) {

    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(
            `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
                filterDto,
            )}`,
        );
        return this.tasksService.getTasks(filterDto, user);
    }

    @Post()
    @Throttle(2,60)
    createTask(
        @Body(ValidationPipe) createTaskDto: CreateTaskDTO,
        // @Ip() ip: string,
        // @Req() request: Request,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(
            `User "${user.username}" creating a new task. Data: ${JSON.stringify(
                createTaskDto,
            )}`,
        );
        // console.log('ip', ip);
        // console.log('request', request);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    async getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(
            `User "${user.username}" getting a task. Data: ${JSON.stringify({
                id: id,
            })}`,
        );
        await new Promise(r => setTimeout(r, 1000));
        return this.tasksService.getTaskById(id, user);
    }

    @Delete('/:id')
    async deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<DeleteResult> {
        this.logger.verbose(
            `User "${user.username}" deleting a task. Data: ${JSON.stringify({
                id: id,
            })}`,
        );
        // return this.tasksService.deleteTaskById(id);
        return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    @UseInterceptors(TimeoutInterceptor)    
    async updateTaskStatusById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User,
    ): Promise<Task> {
        // await new Promise(r => setTimeout(r, 5000));

        console.log('5');
        this.logger.verbose(
            `User "${user.username}" updating a task. Data: ${JSON.stringify({
                id: id,
                status: status,
            })}`,
        );
        return this.tasksService.updateTaskStatusById(id, status, user);
    }
}
