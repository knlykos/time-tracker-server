import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtActivationStrategy } from './strategies/jwt-activation-strategy';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants/constants';
import { ConfigModule } from '@nestjs/config';
import { NkodexDbModule } from '@nkodex-db/nkodex-db';
import { TokenTypeEnum } from './types/token-type.enum/token-type.enum';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NotFoundException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto/login-auth.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot({
          envFilePath: '.development.env',
        }),
        NkodexDbModule.forRoot({
          host: process.env.PG_HOST,
          user: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
          database: process.env.PG_DATABASE,
          max: +process.env.PG_MAX_CONNECTIONS,
        }),
        JwtModule.register({
          secret: jwtConstants.accessSecret,
          signOptions: { expiresIn: '30d', issuer: 'NKODEX' },
        }),
        MailerModule.forRoot({
          transport: {
            host: process.env.MAIL_HOST,
            port: +process.env.MAIL_PORT,
            auth: {
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
            },
          },
          defaults: {
            from: '"nest-modules" <modules@nestjs.com>',
          },
          template: {
            dir: './public/email-templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }),
      ],
      providers: [
        AuthService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        JwtActivationStrategy,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Shoud Test Login', async () => {
    const payload = {
      email: 'nefi.lopezg@gmail.com',
      password: 'Nefo123..',
      confirm_password: 'Nefo123..',
    };
    const accessToken = await service.login(
      payload.email,
      payload.password,
      payload.confirm_password,
    );
    expect(accessToken).toHaveProperty('accessToken');
  });

  it('Shoud Test Login with wrong password', async () => {
    const payload = {
      email: 'nefi.lopezg@gmail.com',
      password: 'Nefo123.!!!.%',
      confirm_password: 'Nefo123.!!!.%',
    };
    try {
      const accessToken = await service.login(
        payload.email,
        payload.password,
        payload.confirm_password,
      );
      expect(accessToken).toHaveProperty('accessToken');
    } catch (e) {
      console.log(e);
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('Shoud Test Login using an not register email', async () => {
    const payload: LoginAuthDto = {
      email: 'nefi.lopezg@gmail.com2',
      password: 'Nefo123..',
      confirmation: 'Nefo123..',
    };

    try {
      await service.login(
        payload.email,
        payload.password,
        payload.confirmation,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });
  it('Should refreshToken return an valid accessToken', async () => {
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lZmkubG9wZXpnQGdtYWlsLmNvbSIsInN1YmplY3QiOjEsImlhdCI6MTY3ODY1NjY4NiwiZXhwIjoxNjgxMjQ4Njg2LCJpc3MiOiJOS09ERVgifQ._fDJcQLYB9QpbBPZQ4Xv0zqb0kKP2XvuOh-klDkAekA';
    const tokenData = await service.refreshToken(accessToken);
    console.log(tokenData);
    expect(tokenData).toHaveProperty('refreshToken');
  });

  it('Should test insertToken', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lZmkubG9wZXpnQGdtYWlsLmNvbSIsImlhdCI6MTY3ODY0MjYzMSwiZXhwIjoxNzY1MDQyNjMxLCJpc3MiOiJOS09ERVgifQ.TkWqN2AXjDR8N8aXmcli1LF84S2IpEPOxlmrUTTUD4g';
    const tokenType = TokenTypeEnum;
    const expires_at = new Date();
    try {
      await service.insertToken(1, tokenType.Access, token, expires_at);
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  it('test revokeTokenByToken', async () => {
    const payload = {
      email: 'nefi.lopezg@gmail.com',
      password: 'Nefo123..',
      confirm_password: 'Nefo123..',
    };
    const token = await service.login(
      payload.email,
      payload.password,
      payload.confirm_password,
    );
    await service.revokeTokenByToken(token.accessToken);
  });

  it('Should test register', async () => {
    const payload: CreateUserDto = {
      email: 'nefi.lopewzg@gmail.com',
      username: 'nefwi.lopez1',
      password: 'Nefo123..',
      confirmation: 'Nefo123..',
    };
    await service.register(payload);
  });

  it('Should test activation endpoint', async () => {
    // const activationLink =
    // 'http://localhost:3000/auth/activation/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lZmkubG9wZXpnQGdtYWlsLmNvbTEiLCJpYXQiOjE2NzkyMzU5NzAsImV4cCI6MTY4MTgyNzk3MCwiaXNzIjoiTktPREVYIn0.tZv-zDN3A8I6uWlrs1lzAZlX_YK1YsbkqCqwx6INX2Q';
    const activationToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lZmkubG9wZXpnQGdtYWlsLmNvbTEiLCJpYXQiOjE2NzkyMzU5NzAsImV4cCI6MTY4MTgyNzk3MCwiaXNzIjoiTktPREVYIn0.tZv-zDN3A8I6uWlrs1lzAZlX_YK1YsbkqCqwx6INX2Q';
    await service.activation(activationToken);
  });
});
