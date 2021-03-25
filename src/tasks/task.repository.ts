import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import {User} from "../auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status: status, search: search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      query.andWhere(
        // Sử dụng ( ) trong câu sql duoi để dùng đồng thời 2 andWhere
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    // console.log('query', query.getQuery());
    return await query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const { title: title, description: description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.userId = user.id;
    // task.user = user;
    await task.save();
    // console.log('task.user', task.user);
    // console.log('task.userId', task.userId);
    // delete task.user;
    return task;
  }
}
