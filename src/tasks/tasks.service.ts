import {Injectable, InternalServerErrorException, NotFoundException, OnModuleInit} from '@nestjs/common';
import {CreateTaskDTO} from './dto/create-task.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {TaskRepository} from './task.repository';
import {Task} from './task.entity';
import {TaskStatus} from './task-status.enum';
import {Connection, DeleteResult} from 'typeorm';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {User} from '../auth/user.entity';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class TasksService implements OnModuleInit  {
    private tasksService: TasksService;

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
        private moduleRef: ModuleRef,
        private connection: Connection,     
    ) {
    }

    async onModuleInit() {
        this.tasksService = await this.moduleRef.resolve(TasksService); 
        // console.log('this.tasksService',this.tasksService);
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}"`);
        }

        return found;
    }

    async deleteTaskById_(id: number, user: User): Promise<any> {
        const task = await this.getTaskById(id, user);
        return this.taskRepository.remove(task);
    }

    async deleteTaskById(id: number, user: User): Promise<any> {
        const queryRunner = this.connection.createQueryRunner();
        console.log('queryRunner', queryRunner);

        // const task = await this.getTaskById(id, user);
       // return this.taskRepository.remove(task);
    }

    async deleteTask(id: number, user: User): Promise<DeleteResult> {
        const queryRunner = this.connection.createQueryRunner();

        const task = await this.getTaskById(id, user);

            await queryRunner.connect();
            await queryRunner.startTransaction();
         
            try {
              const deleteTask = await queryRunner.manager.delete(Task, {
                id: task.id,
                userId: task.userId,
              } );   
              await queryRunner.commitTransaction();
              return deleteTask;
            } catch (error) {
              await queryRunner.rollbackTransaction();
              throw new InternalServerErrorException();
            } finally {
              await queryRunner.release();
            }

    }

    async deleteTask_(id: number, user: User): Promise<DeleteResult> {
        const result = await this.taskRepository.delete({
            id: id,
            userId: user.id,
        });

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return result;
    }

    async updateTaskStatusById(
        id: number,
        status: TaskStatus,
        user: User,
    ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }
}
