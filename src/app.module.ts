import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { LogModule } from './log/log.module';
BigInt.prototype['toJSON'] = function () {
  return this.toString();
};
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '172.17.0.3',
      port: 5432,
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'nkodex_timetracker',
      entities: [],
      synchronize: true,
    }),
    TaskModule,
    LogModule,
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, PrismaService],
})
export class AppModule {}
