import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTaskDto: CreateTaskDTO): Task {
    // const { title: title, description: description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
    // return this.tasks.find((task) => {
    //   return task.id === id;
    // });
  }

  deleteTaskById(id: string) {
    this.tasks = this.tasks.filter((task: Task) => task.id !== id);
  }
}
