import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(product_id: string) {
    return this.productRepository.findOne({
      where: { product_id },
    });
  }

  update(product_id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(product_id, updateProductDto);
  }

  changeStatus(product_id: string, status: UpdateProductStatusDto) {
    return this.productRepository.update(product_id, status);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
