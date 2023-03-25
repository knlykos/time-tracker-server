import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsDefined, IsEnum, IsNumber, IsString } from 'class-validator';
import { ProjectDto } from './project.dto';

export class UpdateProjectDto extends OmitType(ProjectDto, ['id'] as const) {}
