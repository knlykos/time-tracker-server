import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tokens')
export class TokenDTO {
  @PrimaryGeneratedColumn('uuid')
  tokenId: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  token: string;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  userId: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsIn(['ACCESS', 'ACTIVATION', 'REFRESH'])
  type: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  createdBy: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  modifiedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  modifiedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  revokedAt: Date;
}
