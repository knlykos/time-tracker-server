import { IsDefined, IsEnum, IsNumber, IsString } from 'class-validator';

export class ProjectDto {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsEnum([1, 2, 3])
  @IsDefined()
  status: number;
}
