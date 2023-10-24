import { DbRepositories } from '../../main/db.repositories';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsUUID } from 'class-validator';

@Entity('warehouse_move')
export class WarehouseMove extends DbRepositories {
  _name = 'warehouse.move';
  _description = 'Warehouse move Entity';

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  warehouse_move_id: string;

  @Column()
  name: string;

  @Column()
  description: string;
}
