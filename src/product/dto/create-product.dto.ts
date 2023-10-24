import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { ProductStatusEnum } from '../enums/product-enums';
import { PickType } from '@nestjs/mapped-types';
import { Product } from '../entities/product.entity';

export class CreateProductDto extends PickType(Product, [
  'product_name',
  'product_description',
  'sku',
  'upc',
  'ean',
  'isbn',
  'category',
  'price',
  'quantity',
  'picture_url',
  'status',
]) {}
