import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {TasksModule} from './tasks/tasks.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {typeOrmConfig} from './config/typeorm.config';
import {AuthModule} from './auth/auth.module';
import { LoggerMiddleware } from './logger.middleware';
import { TasksController } from './tasks/tasks.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TasksModule,
        AuthModule,
    ],
    providers: [],
    exports: [
        // TypeOrmModule, // có thể sử dụng module này ở các module khác nếu họ import module này.
    ],
})
export class AppModule implements NestModule {
    async configure(consumer: MiddlewareConsumer) {
        await consumer
          .apply(LoggerMiddleware)
          // .forRoutes('tasks');
         // .forRoutes({ path: 'tasks', method: RequestMethod.POST });
         .exclude(
            { path: 'tasks', method: RequestMethod.GET },
            { path: 'tasks', method: RequestMethod.POST },
            // 'tasks/(.*)',
          )
         .forRoutes(TasksController);
   }
}
