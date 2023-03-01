import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Connection } from 'pg';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // password = 'Nefo123..';
    try {
      const accessToken = await this.authService.login(
        body.email,
        body.password,
      );
      return accessToken;
    } catch (e) {
      console.log(e);
    }
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
