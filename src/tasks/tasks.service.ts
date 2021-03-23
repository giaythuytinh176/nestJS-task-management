import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDTO} from './dto/create-task.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {TaskRepository} from './task.repository';
import {Task} from './task.entity';
import {TaskStatus} from "./task-status.enum";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  //
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status: status, search: search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task: Task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task: Task) => {
  //       return task.title.includes(search) || task.description.includes(search);
  //     });
  //   }
  //   return tasks;
  // }

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with ID ${id}`);
    }

    return found;
  }

  async deleteTaskById(id: number): Promise<any> {
    const task = await this.getTaskById(id);
    return this.taskRepository.remove(task);
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  // updateTaskStatusById(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
