import { DbRepositories } from '../../main/db.repositories';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsUUID } from 'class-validator';

@Entity('warehouse_location')
export class WarehouseLocation extends DbRepositories {
  _name = 'warehouse.location';
  _description = 'Warehouse Location Entity';

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  warehouse_location_id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  warehouse_id: string;
}
