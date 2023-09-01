import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { PlantATreeDbService } from './plant-a-tree-db.service';
import { PlantATreeDbConfigOptions } from './plant-a-tree-db-config-options';

@Global()
@Module({
  providers: [PlantATreeDbService],
  exports: [PlantATreeDbService],
})
export class PlantATreeDbModule {
  static forRoot(options: PlantATreeDbConfigOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'PLANT43_DB_CASSANDRA',
        useFactory: (plantATreeDbService: PlantATreeDbService) => {
          return plantATreeDbService.getConnection(options);
        },
        inject: [PlantATreeDbService],
      },
    ];
    return {
      module: PlantATreeDbModule,
      providers: providers,
      exports: providers,
    };
  }
}
