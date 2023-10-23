import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';

export class DbRepositories {
  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  @IsString()
  created_by: string;

  @UpdateDateColumn()
  modified_at: Date;

  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  @IsString()
  modified_by: string;
}
