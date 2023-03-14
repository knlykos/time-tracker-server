import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  NotAcceptableException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Connection } from 'pg';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginAuthDto) {
    // password = 'Nefo123..';
    if (body.password !== body.confirm_password) {
      throw new NotAcceptableException(
        'Password and confirm password must be the same',
      );
    }
    try {
      const accessToken = await this.authService.login(
        body.email,
        body.password,
        body.confirm_password,
      );
      return accessToken;
    } catch (e) {
      console.log(e);
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    await this.authService.refreshToken(body.accessToken);
  }

  // register() {
  //   return;
  //   ('register');
  // }
  //
  // activate() {
  //   return 'activate';
  // }
}
