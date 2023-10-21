import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from '../user.dto/userDto';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class CreateUserDto extends PickType(User, [
  'username',
  'email',
  'password',
]) {}
