import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { JwtRefreshAuthGuard } from '../auth/guards/jwt-refresh-auth/jwt-refresh-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../auth/entity/user.entity/user.entity';
import { ApiResponse } from '../common/response-types/api.response';
import { TaskSucessMessages } from './constants/task-sucess-messages';
import { TasksDto } from './dto/tasks.dto/tasks.dto';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(JwtRefreshAuthGuard)
  async createTask(@User() user: UserEntity, @Body() body: CreateTaskDto) {
    try {
      const taskCreated = await this.taskService.create(body);
      const response = new ApiResponse<TasksDto>(
        TaskSucessMessages.TASK_CREATED,
        taskCreated,
      );
      return response;
    } catch (error) {
      console.log(error.constructor.name);
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }
}
