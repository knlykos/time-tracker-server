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
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../user/user.service';
import { TokenTypeEnum } from './types/token-type.enum/token-type.enum';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

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

  @Post('signup')
  async signUp(@Body() body: CreateUserDto) {
    console.log(body);
    //     Recibe payload con email, phoneNumber, username, password.
    //     Se valida segun las politicas de registro.
    //     Se genera un token que se guardara en las tablas de registro de token para activacion especial para activacion con toda la metadata necesario para activacion de usuario.
    //     Se guarda la información del usuario y se genera un hash del password en la base de datos se guardara el hash.
    //     se genera un email y se envia con el token de activacion.
    //     se regresa respuesta al usuario.
    const uuid = uuidv4();
    const appUrl = this.configService.get('APP_URL');
    const tokenTypes = TokenTypeEnum;
    try {
      await this.userService.create(uuid, body);
      // return new ApiResponse<void>(AuthSuccessMessages.ACCOUNT_REGISTERED);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
    try {
      const tokenData = await this.authService.generateToken(uuid, body.email);
      const iat = tokenData.decoded.iat; // tiempo en que se emitió
      const exp = tokenData.decoded.exp; // tiempo de expiración

      const iatDate = new Date(iat * 1000);
      const expDate = new Date(exp * 1000);

      const token = await this.authService.insertToken(
        uuid,
        tokenTypes.ACTIVATION,
        tokenData.token,
        expDate,
        new Date(0),
      );
      await this.mailerService.sendMail({
        to: body.email,
        from: ' "Nkodex" <  ' + this.configService.get('MAIL_FROM') + '>',
        subject: 'Nkodex - Account Activation - DEV',
        template: 'activation',
        context: {
          activateLink: `${appUrl}/auth/activation/${tokenData.token}`,
        },
      });
    } catch (e) {}
  }

  @Get('activation/:token')
  async activation(@Param('token') token: string) {
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

      const result = await this.userService.activateUser(verifyRes.user_id);

      if (result) {
        await this.authService.revokeTokenByToken(
          tokenRes.token,
          tokenTypes.ACTIVATION,
          verifyRes.user_id,
        );
        return new ApiResponse<void>(AuthSuccessMessages.ACCOUNT_ACTIVATED);
      }
      return new ApiResponse<void>(AuthSuccessMessages.ACCOUNT_ACTIVATED);
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

  //
  // activate() {
  //   return 'activate';
  // }
}
