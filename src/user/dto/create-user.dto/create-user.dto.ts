import { IsString } from 'class-validator';
import { UserDto } from '../user.dto/userDto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto extends PartialType(UserDto) {
  // @IsString()
  // confirmation: string;
  // readonly id: number;
  // @IsEmail()
  // readonly email: string;
  // @IsString()
  // readonly username: string;
  // @IsString()
  // readonly password: string;
}
