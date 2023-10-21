import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { User } from '../../../user/dto/user.dto/userDto';

export class LoginAuthDto extends PartialType(User) {
  // TODO: add min y max validation for password and confirmation
  // @IsEmail()
  // readonly email: string;
  // @IsString()
  // @MinLength(6)
  // readonly password: string;
  // @IsString()
  // readonly confirm_password: string;
}
