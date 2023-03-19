import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserDtoTs } from '../user.dto.ts/user.dto.ts';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto extends PartialType(UserDtoTs) {
  @IsString()
  confirmation: string;
  // readonly id: number;
  // @IsEmail()
  // readonly email: string;
  // @IsString()
  // readonly username: string;
  // @IsString()
  // readonly password: string;
}
