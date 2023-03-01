import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { NkodexDbService } from './nkodex-db.service';

@Global()
@Module({
  providers: [NkodexDbService],
  exports: [NkodexDbService],
})
export class NkodexDbModule {
  static forRoot(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'PG_CONNECTION',
        useFactory: (nkodexDbService: NkodexDbService) => {
          return nkodexDbService.getConnection();
        },
        inject: [NkodexDbService],
      },
    ];
    console.log(providers);
    return {
      module: NkodexDbModule,
      providers: providers,
      exports: providers,
    };
  }
}
