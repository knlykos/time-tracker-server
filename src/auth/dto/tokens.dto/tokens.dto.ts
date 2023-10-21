import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID, IsString, IsIn, IsOptional, IsDate } from 'class-validator';

@Entity({ schema: 'public', name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  token_id: string;

  @Column({ type: 'text' })
  @IsString()
  token: string;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  user_id: string;

  @Column({
    type: 'text',
  })
  @IsIn(['ACCESS', 'ACTIVATION', 'REFRESH'])
  type: string;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  created_by: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  expires_at: Date;

  @UpdateDateColumn()
  @IsDate()
  modified_at: Date;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  modified_by: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  revoked_at: Date;
}