import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseInterceptors,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { ApiResponseInterceptor } from '../common/api-response/api-response.interceptor';
import { ApiResponse } from '../common/response-types/api.response';
import { ProductSuccessMessages } from './constants/product-success-messages';
import { Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(ApiResponseInterceptor)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    try {
      const newProduct = await this.productService.create(createProductDto);
      const apiResponse = ApiResponse.created(
        ProductSuccessMessages.PRODUCT_CREATED,
        newProduct,
      );

      res.status(apiResponse.getStatus()).json(apiResponse);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    // return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':product_id')
  findOne(@Param('product_id') product_id: string) {
    return this.productService.findOne(product_id);
  }

  @Patch(':product_id')
  update(@Param('product_id') product_id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(product_id, updateProductDto);
  }

  @Put(':product_id/changeStatus')
  async changeStatus(
    @Param('product_id', ParseIntPipe) product_id: string,
    @Body() status: UpdateProductStatusDto,
  ) {
    return this.productService.changeStatus(product_id, status);
  }
}
