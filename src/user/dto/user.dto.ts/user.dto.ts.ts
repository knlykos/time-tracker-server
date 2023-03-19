import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDtoTs {
  @IsNumber()
  readonly id: number;
  @IsEmail()
  readonly email?: string;
  @IsString()
  readonly username?: string;
  @IsString()
  readonly password?: string;
  @IsNumber()
  @IsOptional()
  readonly status?: number;
  @IsNumber()
  @IsOptional()
  readonly group_id?: number;
  @IsNumber()
  @IsOptional()
  readonly org_id?: number;
  @IsNumber()
  @IsOptional()
  readonly role_id?: number;
  @IsNumber()
  @IsOptional()
  readonly client_id?: number;
  @IsNumber()
  @IsOptional()
  readonly rate?: number;
  @IsString()
  @IsOptional()
  readonly quota_percent?: string;
  @IsString()
  @IsOptional()
  readonly lastname?: string;
  @IsString()
  @IsOptional()
  readonly name?: string;
}
