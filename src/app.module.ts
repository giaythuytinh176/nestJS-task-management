import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
      TypeOrmModule.forRoot(typeOrmConfig),
      TasksModule
  ],
  providers: [],
  exports: [
      TypeOrmModule, // có thể sử dụng module này ở các module khác nếu họ import module này.
  ],
})
export class AppModule {}
