import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  readonly email: string;
  @IsString()
  @MinLength(6)
  readonly password: string;
  @IsString()
  readonly confirm_password: string;
}
