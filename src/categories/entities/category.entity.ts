import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"
import { IsNumber, IsString } from 'class-validator';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsString()
  name: string

  @Column({ default: '' })
  @IsString()
  description: string

  @ManyToOne((type) => Category, (category) => category.children)
  @IsNumber()
  parent: Category

  @OneToMany((type) => Category, (category) => category.parent)
  children: Category[]
}

// https://akki.ca/blog/mysql-adjacency-list-model-for-hierarchical-data-using-cte/