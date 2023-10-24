import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtActivationStrategy } from './strategies/jwt-activation-strategy';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NkodexDbModule } from '@nkodex-db/nkodex-db';
import { TokenTypeEnum } from './types/token-type.enum/token-type.enum';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NotFoundException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto/login-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { commonModuleImportConf } from '../tests-utils/common-module.test';
import { UserService } from '../user/user.service';

describe.only('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, ...commonModuleImportConf],
      providers: [
        AuthService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        JwtActivationStrategy,
        UserService,
        ConfigService,
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it.only('Should generateToken return a valid token', () => {
    const uuid = uuidv4();
    const token = service.generateToken(uuid, faker.internet.email());
    console.log(token);
    expect(token).toBeDefined();
  });
});
