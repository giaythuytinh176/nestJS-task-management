import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status: status, search: search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      query.andWhere(
        // Sử dụng ( ) trong câu sql dứoi để dùng đồng thời 2 andWhere
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    // console.log('query', query.getQuery());
    return await query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    const { title: title, description: description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }
}
