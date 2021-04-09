import {MiddlewareConsumer, Module, NestModule, RequestMethod, UseFilters} from '@nestjs/common';
import {TasksModule} from './tasks/tasks.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {typeOrmConfig} from './config/typeorm.config';
import {AuthModule} from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TasksController } from './tasks/tasks.controller';
import { HttpExceptionFilter } from './ExceptionFilters/http-exception.filter';
import { AuthController } from './auth/auth.controller';
import { getConnectionOptions } from 'typeorm';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () =>
              Object.assign(await getConnectionOptions(), {
                autoLoadEntities: true,
              }),
          }), // typeOrmConfig
        TasksModule,
        AuthModule,
        ThrottlerModule.forRoot({
          ttl: 60, // seconds
          limit: 5, 
        }),
        // SequelizeModule.forRoot({
        //     dialect: 'postgres',
        //     host: 'localhost',
        //     port: 5432,
        //     username: 'postgres',
        //     password: 'postgres',
        //     database: 'task-manager-2',
        //     models: [],
        //   }),
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
        //  .exclude(
        //     { path: 'tasks', method: RequestMethod.GET },
        //     { path: 'tasks', method: RequestMethod.POST },
        //     // 'tasks/(.*)', 
        //   )
         .forRoutes(TasksController, AuthController);
   }
}
