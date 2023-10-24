import { DbRepositories } from '../../main/db.repositories';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsUUID } from 'class-validator';

@Entity('warehouse')
export class Warehouse extends DbRepositories {
  _name = 'Warehouse';
  _description = 'Warehouse Entity';

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  warehouse_id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  locations_id: string;
}
