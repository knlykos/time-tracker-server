import { IsEnum, IsIn, IsNotEmpty } from 'class-validator';

export class UpdateProductStatusDto {
  @IsNotEmpty()
  @IsIn([
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'SUSPENDED',
    'NOT_VERIFIED',
    'DELETED',
  ], {
    message: `Invalid status. Status must be one of: ${Object.values([
      'ACTIVE',
      'INACTIVE',
      'PENDING',
      'SUSPENDED',
      'NOT_VERIFIED',
      'DELETED',
    ]).join(', ')}`,
  })
  status: string;
}