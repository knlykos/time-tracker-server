import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { ProductStatusEnum } from '../enums/product-enums';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  sku: string;

  // @IsNotEmpty()
  upc: string;

  // @IsNotEmpty()
  ean: string;

  // @IsNotEmpty()
  isbn: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  pictureUrl: string;

  @IsIn([
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'SUSPENDED',
    'NOT_VERIFIED',
    'DELETED',
  ])
  status: string;
}