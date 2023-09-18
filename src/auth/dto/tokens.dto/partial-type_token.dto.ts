import { TokenDTO } from './tokens.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class PartialTypeToken extends PartialType(TokenDTO) {
  @IsString()
  @IsOptional({ always: false })
  token: string;
}
