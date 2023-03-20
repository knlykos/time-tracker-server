import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotAcceptableException,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { ApiResponse } from '../common/response-types/api.response';
import { AuthSuccessMessages } from './constants/auth-success-messages';
import { AuthGuard } from '@nestjs/passport';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth/jwt-access-auth.guard';
import { User } from './decorators/user.decorator';
import { UserEntity } from './entity/user.entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginAuthDto) {
    // password = 'Nefo123..';
    try {
      if (body.password !== body.confirmation) {
        throw new NotAcceptableException(
          'Password and confirm password must be the same',
        );
      }

      const accessToken = await this.authService.login(
        body.email,
        body.password,
        body.confirmation,
      );
      return accessToken;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('refresh-token')
  async refreshToken(@User() user: UserEntity) {
    try {
      return await this.authService.refreshToken(user);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
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
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Get('activation/:token')
  async activation(@Param('token') token: string) {
    try {
      await this.authService.activation(token);
      const response: ApiResponse<void> = {
        message: AuthSuccessMessages.ACCOUNT_ACTIVATED,
      };
      return response;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  //
  // activate() {
  //   return 'activate';
  // }
}
