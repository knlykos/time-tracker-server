import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';
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

@Entity('users')
@Unique(['email'])
@Unique(['username'])
@Index('idx_users_email', ['email'])
@Index('idx_users_username', ['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  @IsString()
  created_by: string;

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

  @UpdateDateColumn()
  modified_at: Date;

  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  @IsString()
  modified_by: string;

  @Column({ type: 'text' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  @IsString()
  phone_number: string;

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
