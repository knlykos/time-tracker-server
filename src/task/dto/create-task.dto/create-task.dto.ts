import { PartialType } from '@nestjs/mapped-types';
import { TasksDto } from '../tasks.dto/tasks.dto';

export class CreateTaskDto extends PartialType(TasksDto) {}
