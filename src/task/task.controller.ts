import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  Put,
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
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly authService: AuthService,
  ) {}

  @Get('id/:id')
  @UseGuards(JwtRefreshAuthGuard)
  async findById(@User() user: UserEntity, @Param('id') id: number) {
    try {
      const tasks = await this.taskService.findById(id, user.subject);
      const response = new ApiResponse<TasksDto[]>(
        TaskSucessMessages.TASK_FOUND,
        tasks,
      );
      return response;
    } catch (error) {
      console.log(error.constructor.name);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Post()
  @UseGuards(JwtRefreshAuthGuard)
  async createTask(@User() user: UserEntity, @Body() body: CreateTaskDto) {
    try {
      const taskCreated = await this.taskService.create(body, user.subject);
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
      throw new InternalServerErrorException();
    }
  }

  @Put()
  async updateTask(@User() user: UserEntity, @Body() payload: UpdateTaskDto) {
    try {
      await this.taskService.update(payload);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }
}
