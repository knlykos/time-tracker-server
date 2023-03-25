import { PartialType } from '@nestjs/mapped-types';
import { TasksDto } from '../tasks.dto/tasks.dto';
import { IsDefined, IsIn, IsNumber, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(TasksDto) {
  @IsNumber()
  task_id: number;

  priority: number;
}
