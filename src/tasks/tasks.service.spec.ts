import {Test} from '@nestjs/testing';
import {TasksService} from './tasks.service';
import {TaskRepository} from './task.repository';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {TaskStatus} from './task-status.enum';
import {InternalServerErrorException, NotFoundException} from '@nestjs/common';

const mockUser = {id: 1, username: 'admin'};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    // CHay moi lan test, thong can khai bao lai.
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TaskRepository, useFactory: mockTaskRepository},
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        // console.log('tasksService', taskRepository);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            // Gia su dat ket qua tra ve gia la someValue.
            taskRepository.getTasks.mockResolvedValue('someValue');

            // Check xem taskRepository.getTasks duoc call chua
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            // Bat dau khai bao gia tri.
            const filters: GetTasksFilterDto = {status: TaskStatus.IN_PROGRESS, search: 'Some search query'};
            // Goi ham getTasks tu tasksService de kiem tra.
            const result = await tasksService.getTasks(filters, mockUser);
            /// kiem se xem taskrepositoryu.getTasks duoc goi chua
            expect(taskRepository.getTasks).toHaveBeenCalled();
            // So ket ket qua voi gia tri someValue.
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
            const mockTask = {title: 'Test task', description: 'Test desc'};
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id,
                },
            });
        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('calls taskRepository.create() and returns the result', async () => {
            taskRepository.createTask.mockResolvedValue('someTask');

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTaskDto = {title: 'Test task', description: 'Test desc'};
            const result = await tasksService.createTask(createTaskDto, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
            expect(result).toEqual('someTask');
        });
    });

    describe('deleteTask', () => {
        it('calls taskRepository.deleteTask() to delete a task', async () => {
            // Gi??? s???a mock tr??? v??? gi?? tr??? khi delete l?? { affected : 1 }
            taskRepository.delete.mockResolvedValue({affected: 1});
            expect(taskRepository.delete).not.toHaveBeenCalled();
            // TH???c hi???n g???i deleteTask ????? xo?? task n??y v???i User n??o ????.
            await tasksService.deleteTask(1, mockUser);
            // Ki???m tra xem taskrepository.delete ???? ???????c g???i ch??a
            expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id});


        });


        it('throws an error as task could not be found', () => {
            // Giar s??? d??? li???u v??? l?? { effect: 0} - user ko t???n t???i
            taskRepository.delete.mockResolvedValue({affected: 0});
            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTaskStatus', () => {
        it('updates a task status', async () => {
            //  Khai b??o d??? li???u ?????u c???a save l?? true
            const save = jest.fn().mockResolvedValue(true);
// Khai b??o d??? i???u ????u ra l?? tasksService...
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save: save,
            });
//Ki???m tra xem tasksService.getHTaskbyId c?? ???????c g???i ko
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
//Ki???m tra xe h??m save xem c?? ???????c g???i ko.
            expect(save).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatusById(1, TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});
