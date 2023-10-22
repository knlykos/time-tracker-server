import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsIn } from 'class-validator';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  SKU: string;

  @Column({ nullable: true })
  ean: string;

  @Column({ nullable: true })
  upc: string;

  @Column({ nullable: true })
  isbn: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  price: number;

  // Temporal
  @Column({ nullable: true })
  quantity: number; // Stock

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date

  @Column({ nullable: true })
  pictureUrl: string;

  @Column({
    type: 'enum',
    enum: [
      'ACTIVE',
      'INACTIVE',
      'PENDING',
      'SUSPENDED',
      'NOT_VERIFIED',
      'DELETED',
    ],
    default: 'PENDING',
  })
  status: string;
}