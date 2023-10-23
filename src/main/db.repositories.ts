import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';

export class DbRepositories {
  _name: string;
  _description: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true, type: 'text' })
  @IsString()
  created_by: string;

  @UpdateDateColumn()
  modified_at: Date;

  @Column({ nullable: true, type: 'text' })
  @IsString()
  modified_by: string;
}
