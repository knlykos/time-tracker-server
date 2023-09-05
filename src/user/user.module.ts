import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { commonModuleImportConf } from '../tests-utils/common-module.test';

@Module({
  imports: [...commonModuleImportConf],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
