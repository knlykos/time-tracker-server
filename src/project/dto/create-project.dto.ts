import { IsDefined, IsEnum, IsNumber, IsString } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { ProjectDto } from './project.dto';

export class CreateProjectDto extends OmitType(ProjectDto, ['id'] as const) {}
