import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  InternalServerErrorException,
  NotAcceptableException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { ApiResponse } from '../common/response-types/api.response';
import { AuthSuccessMessages } from './constants/auth-success-messages';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginAuthDto) {
    // password = 'Nefo123..';
    try {
      if (body.password !== body.confirm_password) {
        throw new NotAcceptableException(
          'Password and confirm password must be the same',
        );
      }

      const accessToken = await this.authService.login(
        body.email,
        body.password,
        body.confirm_password,
      );
      return accessToken;
    } catch (e) {
      throw e;
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    await this.authService.refreshToken(body.accessToken);
  }

  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<ApiResponse<void>> {
    try {
      await this.authService.register(body);
      const response: ApiResponse<void> = {
        message: AuthSuccessMessages.ACCOUNT_REGISTERED,
      };
      return response;
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Get('activation/:token')
  async activation(@Param('token') token: string) {
    return 'activated';
  }

  //
  // activate() {
  //   return 'activate';
  // }
}
