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
      console.log(user);
      await this.taskService.create(body);
    } catch (error) {
      throw error;
    }
  }
}
