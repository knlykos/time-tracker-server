import { TokensDto } from './tokens.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class PartialTypeToken extends PartialType(TokensDto) {
  @IsString()
  @IsOptional({ always: false })
  token: string;
}
