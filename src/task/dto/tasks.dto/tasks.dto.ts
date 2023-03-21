import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';

export class TasksDto {
  @IsNumber()
  task_id?: number;
  @IsNumber()
  group_id?: number;
  @IsNumber()
  org_id?: number;
  @IsString()
  task_name?: string;
  @IsString()
  task_description?: string;
  @IsNumber()
  project_id?: number;
  @IsNumber()
  priority?: number;
  @IsNumber()
  estimated_time?: number;
  @IsNumber()
  assignee?: number;
  @IsDateString()
  created_at?: Date | string;
  @IsDateString()
  due_date?: Date | string;
  @IsNumber()
  task_status?: number;
}
