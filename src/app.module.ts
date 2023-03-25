import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';

import { LogModule } from './log/log.module';
import { NkodexDbModule } from '@nkodex-db/nkodex-db';
import { UserModule } from './user/user.module';
import { jwtConstants } from './auth/constants/constants';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ProjectModule } from './project/project.module';

BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    AuthModule,
    UserModule,
    TaskModule,
    LogModule,
    NkodexDbModule.forRoot({
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      max: +process.env.PG_MAX_CONNECTIONS,
    }),
    ProjectModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
