import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLogDto {
  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsNumber()
  orgId?: number;

  @IsDateString()
  date: Date;

  @IsDateString()
  startTime: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsNumber()
  projectId: number;

  @IsNumber()
  taskId: number;

  @IsOptional()
  @IsNumber()
  timesheetId?: number;

  @IsOptional()
  @IsNumber()
  invoiceId?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  billable?: boolean;

  @IsEnum([1, 2])
  status?: number;
}
