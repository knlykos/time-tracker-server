import { DbRepositories } from '../../main/db.repositories';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsIn, IsNumber, IsString, IsUUID } from 'class-validator';

@Entity('warehouse_move_line')
export class WarehouseMoveLine extends DbRepositories {
  _name = 'warehouse.move.line';
  _description = 'Warehouse move line Entity';

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  warehouse_move_line_id: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  warehouse_move_id: string;

  @Column()
  @IsString()
  product_id: string;

  @Column()
  @IsString()
  @IsIn(['INBOUND', 'OUTBOUND'])
  move_type: string;

  @Column()
  @IsNumber()
  quantity: number;
}
