import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

import { NkodexDbModule } from '@nkodex-db/nkodex-db';
import { UserModule } from './user/user.module';
import { jwtConstants } from './auth/constants/constants';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { ProjectModule } from './project/project.module';
import { PlantATreeDbModule } from '@plant43db/plant-a-tree-db';
import { auth, ClientOptions } from 'cassandra-driver';
import PlainTextAuthProvider = auth.PlainTextAuthProvider;
import { DataSource } from 'typeorm';
import { User } from './user/dto/user.dto/userDto';
import { Token } from './auth/dto/tokens.dto/tokens.dto';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { WarehouseModule } from './warehouse/warehouse.module';

BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [User, Token, Product],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
    }),
    UserModule,
    ProductModule,
    WarehouseModule,
    //
    // PlantATreeDbModule.forRoot({
    //   contactPoints: [process.env.CASSANDRA_HOST],
    //   localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
    //   keyspace: process.env.CASSANDRA_KEYSPACE,
    //   authProvider: new PlainTextAuthProvider('cassandra', 'cassandra'),
    //   pooling: {
    //     coreConnectionsPerHost: {
    //       '0': 8, // remote hosts
    //       '1': 2, // local hosts
    //       '2': 1, // used hosts
    //     },
    //     maxRequestsPerConnection: 128,
    //     heartBeatInterval: 60000,
    //   },
    // }),
    // NkodexDbModule.forRoot({
    //   host: process.env.PG_HOST,
    //   user: process.env.PG_USER,
    //   password: process.env.PG_PASSWORD,
    //   database: process.env.PG_DATABASE,
    //   max: +process.env.PG_MAX_CONNECTIONS,
    // }),
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    // {
    //   provide: 'ERP_PG',
    //   useFactory: async () => {
    //     const dataSource = new DataSource({
    //       type: 'postgres',
    //       host: process.env.PG_HOST,
    //       port: +process.env.PG_PORT,
    //       username: process.env.PG_USER,
    //       password: process.env.PG_PASSWORD,
    //       database: process.env.PG_DATABASE,
    //       entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    //       synchronize: true,
    //     });
    //
    //     return dataSource.initialize();
    //   },
    // },
  ],
})
export class AppModule {}
