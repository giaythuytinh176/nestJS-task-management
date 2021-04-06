import {
    Body,
    Controller,
    Delete,
    Get,
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
import { HttpExceptionFilter } from 'src/ExceptionFilters/http-exception.filter';

@Controller('tasks')
@UseGuards(AuthGuard())
// load HttpExceptionFilter
// @UseFilters(HttpExceptionFilter)
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(private tasksService: TasksService) {
    }

    @Get()
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
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(
            `User "${user.username}" getting a task. Data: ${JSON.stringify({
                id: id,
            })}`,
        );
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
    updateTaskStatusById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(
            `User "${user.username}" updating a task. Data: ${JSON.stringify({
                id: id,
                status: status,
            })}`,
        );
        return this.tasksService.updateTaskStatusById(id, status, user);
    }
}
