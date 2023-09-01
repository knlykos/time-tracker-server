import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  readonly id: number;
  @IsEmail()
  readonly email?: string;
  @IsString()
  readonly username?: string;
  @IsString()
  readonly password?: string;
  @IsString()
  @IsOptional()
  readonly status?: string;
  @IsString()
  @IsOptional()
  readonly lastname?: string;
  @IsString()
  @IsOptional()
  readonly name?: string;
}
