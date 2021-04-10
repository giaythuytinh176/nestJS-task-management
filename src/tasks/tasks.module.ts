import {CacheModule, CACHE_MANAGER, Module} from '@nestjs/common';
import {TasksController} from './tasks.controller';
import {TasksService} from './tasks.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TaskRepository} from './task.repository';
import {AuthModule} from '../auth/auth.module';
import { TaskSubscriber } from '../subscriber/task.subscriber';

@Module({
    imports: [
        CacheModule.register(),
        TypeOrmModule.forFeature([TaskRepository]),
        AuthModule,
    ],
    controllers: [
        TasksController,
    ],
    providers: [
        TasksService,
        TaskSubscriber,
    ],
})
export class TasksModule {
}
