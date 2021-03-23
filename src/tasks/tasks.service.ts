import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status: status, search: search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task: Task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task: Task) => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }
    return tasks;
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

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((task: Task) => task.id !== id);
  }

  updateTaskStatusById(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
