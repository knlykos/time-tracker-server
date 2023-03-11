import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  // readonly id: number;
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly username: string;
  @IsString()
  readonly password: string;
  @IsNumber()
  readonly status: number;
  @IsNumber()
  readonly group_id: number;
  @IsNumber()
  readonly org_id: number;
  @IsNumber()
  readonly role_id: number;
  @IsNumber()
  readonly client_id: number;
  @IsNumber()
  readonly rate: number;
  @IsString()
  readonly quota_percent: string;
  @IsString()
  readonly lastname: string;
  @IsString()
  readonly name: string;
}
