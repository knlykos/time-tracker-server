import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsString()
  readonly user_id?: string;
  @IsEmail()
  @MaxLength(50)
  readonly email: string;
  @IsString()
  @MinLength(6)
  readonly username: string;
  @IsString()
  @MaxLength(50)
  @MinLength(6)
  readonly password?: string;
  @IsString()
  @IsOptional()
  readonly status?: string;
  @IsString()
  @IsOptional()
  @MaxLength(30)
  @MinLength(1)
  readonly lastname?: string;
  @IsString()
  @IsOptional()
  @MaxLength(30)
  @MinLength(1)
  readonly firstname?: string;
  @IsString()
  @IsOptional()
  readonly phone_number?: string;
}
