import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, IsNull
} from "typeorm";
import {
  IsEmpty,
  IsIn,
  IsISBN,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString,
  IsUUID
} from "class-validator";
import { DbRepositories } from '../../main/db.repositories';

@Entity()
export class Product extends DbRepositories {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  product_id: string;

  @Column({ nullable: true })
  @IsString()
  product_name: string;

  @Column({ nullable: true })
  @IsString()
  product_description: string;

  @Column({ nullable: true })
  @IsString()
  sku: string;

  @Column({ nullable: true })
  @IsString()
  ean: string;

  @Column({ nullable: true })
  @IsString()
  upc: string;

  @Column({ nullable: true })
  @IsOptional()
  isbn: string;

  @Column({ nullable: true })
  @IsString()
  category: string;

  @Column({ nullable: true })
  @IsNumber()
  price: number;

  // Temporal
  @Column({ nullable: true })
  @IsNumber()
  quantity: number; // Stock

  @Column({ nullable: true })
  @IsString()
  picture_url: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  @IsIn(
    ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED', 'NOT_VERIFIED', 'DELETED'],
    {
      message: `Invalid status. Status must be one of: ${Object.values([
        'ACTIVE',
        'INACTIVE',
        'PENDING',
        'SUSPENDED',
        'NOT_VERIFIED',
        'DELETED',
      ]).join(', ')}`,
    },
  )
  status: string;
}
