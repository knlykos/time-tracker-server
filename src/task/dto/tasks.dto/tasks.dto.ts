import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

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
  @IsString()
  priority?: string;
  @IsNumber()
  estimated_time?: number;
  @IsNumber()
  assignee?: number;
  @IsDate()
  created_at?: Date;
  @IsDate()
  due_date?: Date;
  @IsNumber()
  task_status?: number;
}
