import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { commonModuleImportConf } from '../tests-utils/common-module.test';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './dto/user.dto/userDto';

@Module({
  imports: [...commonModuleImportConf, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
