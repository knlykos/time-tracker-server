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
  UnauthorizedException,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

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
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../user/user.service';
import { TokenTypeEnum } from './types/token-type.enum/token-type.enum';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDto } from '../user/dto/user.dto/userDto';
import { UserMessages } from '../user/constant/common/user-messages';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

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

  @Post('signup')
  async signUp(@Body() body: CreateUserDto, @Res() res: Response) {
    // console.log('here')
    //     Recibe payload con email, phoneNumber, username, password.
    //     Se valida segun las politicas de registro.
    //     Se genera un token que se guardara en las tablas de registro de token para activacion especial para activacion con toda la metadata necesario para activacion de usuario.
    //     Se guarda la información del usuario y se genera un hash del password en la base de datos se guardara el hash.
    //     se genera un email y se envia con el token de activacion.
    //     se regresa respuesta al usuario.
    let user: UserDto;
    try {
      user = await this.userService.create(body);
      // return new ApiResponse<void>(AuthSuccessMessages.ACCOUNT_REGISTERED);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
    try {
      await this.authService.generateActivationToken(user.user_id, user.email);
      const apiResponse = ApiResponse.created(UserMessages.USER_CREATED);
      res.status(apiResponse.getStatus()).json(apiResponse);
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Post('get-new-token/:email')
  async generateNewToken(@Param('email') email: string, @Res() res: Response) {
    try {
      const newEmail = email.toLowerCase();
      const user = await this.userService.findOneByEmail(newEmail);
      await this.authService.generateActivationToken(user.user_id, newEmail);
      const apiResponse = ApiResponse.created(AuthSuccessMessages.EMAIL_SENT);
      res.status(apiResponse.getStatus()).json(apiResponse);
    } catch (e) {
      console.log(e, 'generateNewToken');
      if (e instanceof HttpException) {
        throw e;
      }
      throw new BadRequestException();
    }
  }

  @Get('activation/:token')
  async activation(@Param('token') token: string, @Res() res: Response) {
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    const tokenTypes = TokenTypeEnum;
    try {
      const verifyRes = this.jwtService.verify<{ user_id: string }>(token, {
        secret: jwtConstants.activationSecret,
      });
      const tokenRes = await this.authService.getToken(token);
      if (!tokenRes) {
        throw new UnauthorizedException('Invalid token');
      } else if (
        tokenRes.type !== tokenTypes.ACTIVATION &&
        tokenRes.revoked_at.getTime() !== new Date(0).getTime()
      ) {
        throw new UnauthorizedException('Invalid token');
      }
      console.log(verifyRes);
      const result = await this.userService.activateUser(verifyRes.user_id);

      await this.authService.revokeTokenByToken(
        tokenRes.token,
        tokenTypes.ACTIVATION,
        verifyRes.user_id,
      );
      const apiResponse = ApiResponse.created(
        AuthSuccessMessages.ACCOUNT_ACTIVATED,
      );

      return res.status(apiResponse.getStatus()).json(apiResponse);
    } catch (e) {
      console.log(e);
      if (e.constructor.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('login')
  async login(@Body() body: LoginAuthDto) {
    // password = 'Nefo123..';
    try {
      const user = await this.userService.findOneByEmail(body.email);
      await this.authService.comparePasswords(body.password, user.password);
      const token = this.jwtService.sign({
        email: user.email,
        subject: user.user_id,
      });
      const tokenPayload = this.jwtService.verify(token);
      console.log(tokenPayload);
      await this.authService.insertToken(
        user.user_id,
        TokenTypeEnum.ACCESS,
        token,
        tokenPayload.exp,
      );
      return { accessToken: token };
    } catch (e) {
      console.log(e);
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
