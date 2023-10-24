import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';
import {
  IsEmail,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsIn,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DbRepositories } from '../../../main/db.repositories';

@Entity('users')
@Unique(['email'])
@Unique(['username'])
@Index('idx_users_email', ['email'])
@Index('idx_users_username', ['username'])
export class User extends DbRepositories {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  user_id: string;

  @Column({ type: 'text' })
  @IsEmail()
  email: string;

  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  @IsString()
  firstname: string;

  @Column({ nullable: true, type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  is_system_user: boolean;

  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  @IsString()
  lastname: string;

  @Column({ type: 'text' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  @IsString()
  phone_number: string;

  @IsIn([
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'SUSPENDED',
    'NOT_VERIFIED',
    'DELETED',
  ])
  status: string;

  @Column({ type: 'text' })
  @IsString()
  username: string;
}
