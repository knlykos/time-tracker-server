import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID, IsString, IsIn, IsOptional, IsDate } from 'class-validator';
import { DbRepositories } from '../../../main/db.repositories';

@Entity({ schema: 'public', name: 'tokens' })
export class Token extends DbRepositories {
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

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  expires_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  revoked_at: Date;
}
