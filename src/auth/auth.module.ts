import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NkodexDbModule } from '@nkodex-db/nkodex-db';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants/constants';
import { JwtActivationStrategy } from './strategies/jwt-activation-strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { ConfigModule } from '@nestjs/config';
import { LoginService } from './login/login.service';
import { SignupService } from './signup/signup.service';
import { TokenRepositoryDTO } from './repositories/tokens.dto';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
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
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtActivationStrategy,
    LoginService,
    SignupService,
    {
      provide: 'AUTH_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(TokenRepositoryDTO),
      inject: ['PLANT43_DATABASE'],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
