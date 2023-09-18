import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UserDto } from '../user.dto/userDto';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class CreateUserDto extends PickType(UserDto, [
  'username',
  'email',
  'password',
]) {}
