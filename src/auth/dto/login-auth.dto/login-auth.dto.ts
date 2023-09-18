import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from '../../../user/dto/user.dto/userDto';

export class LoginAuthDto extends PartialType(UserDto) {
  // TODO: add min y max validation for password and confirmation
  // @IsEmail()
  // readonly email: string;
  // @IsString()
  // @MinLength(6)
  // readonly password: string;
  // @IsString()
  // readonly confirm_password: string;
}
