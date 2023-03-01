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

BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

@Module({
  imports: [
    AuthModule,
    UserModule,
    TaskModule,
    LogModule,
    NkodexDbModule.forRoot(),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
