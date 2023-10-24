import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { PlantATreeDbModule } from '@plant43db/plant-a-tree-db';
import { auth } from 'cassandra-driver';
import PlainTextAuthProvider = auth.PlainTextAuthProvider;
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UserService } from '../user/user.service';
import { commonModuleImportConf } from '../tests-utils/common-module.test';
import { AuthService } from './auth.service';

ConfigModule.forRoot({
  envFilePath: '.development.env',
});
describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, ...commonModuleImportConf],
      controllers: [AuthController],
      providers: [AuthService, UserService, ConfigService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
