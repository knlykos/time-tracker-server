import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseLocation } from './entities/warehouse-location.entity';
import { WarehouseMove } from './entities/warehouse-move.entity';
import { WarehouseMoveLine } from './entities/warehouse-move-line.entity';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService],
  imports: [
    TypeOrmModule.forFeature([
      Warehouse,
      WarehouseLocation,
      WarehouseMove,
      WarehouseMoveLine,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class WarehouseModule {}
