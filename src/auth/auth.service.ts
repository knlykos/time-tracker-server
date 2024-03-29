import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenTypeEnum } from './types/token-type.enum/token-type.enum';
import { PoolClient } from 'pg';
import { Token } from './dto/tokens.dto/tokens.dto';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { jwtConstants } from './constants/constants';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ConfigService } from '@nestjs/config';
import { AuthenticationErrors } from './constants/auth-error-messages';
import { UserEntity } from './entity/user.entity/user.entity';
import { UserStatusEnum } from '../user/enums/user-enums';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../common/response-types/api.response';
import { User } from '../user/dto/user.dto/userDto';
import { TokenRepositoryDTO } from './repositories/tokens.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  appUrl = this.configService.get('APP_URL');

  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    // @Inject('PG_CONNECTION') private dbClient: PoolClient,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private readonly configService: ConfigService,
  ) {}

  async comparePasswords(password: string, hashedPassword: string) {
    return await new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result) {
          resolve(result);
        }
        reject(new UnauthorizedException());
      });
    });
  }

  async login(email: string, password: string, confirmation: string) {
    try {
      if (password !== confirmation) {
        throw new UnauthorizedException('Passwords do not match');
      }
      const user = await this.userService.findOneByEmail(email);
      const passwordMatch = await new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
      if (passwordMatch) {
        const token = this.jwtService.sign({
          email: user.email,
          subject: user.user_id,
        });

        const tokenPayload = this.jwtService.verify(token);
        const type = TokenTypeEnum;

        // tokenPayload.exp
        await this.insertToken(
          tokenPayload.subject,
          type.ACCESS,
          token,
          tokenPayload.exp,
        );
        return { accessToken: token };
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  async refreshToken(
    accessTokenPayload: UserEntity,
  ): Promise<{ refreshToken: string }> {
    try {
      const token = this.jwtService.sign(
        {
          email: accessTokenPayload.email,
          subject: accessTokenPayload.subject,
        },
        {
          secret: jwtConstants.refreshSecret,
        },
      );
      const tokenPayload = this.jwtService.verify(token, {
        secret: jwtConstants.refreshSecret,
      });
      const type = TokenTypeEnum;

      await this.insertToken(
        tokenPayload.subject,
        type.REFRESH,
        token,
        tokenPayload.exp,
      );
      return { refreshToken: token };
    } catch (e) {
      if (e.constructor.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          'Error generating refresh token: ' + e.message,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async generateToken(
    user_id: string,
    email: string,
  ): Promise<{
    token: string;
    iatDate: Date;
    expDate: Date;
    decoded: {
      user_id: string;
      email: string;
      iat: number;
      exp: number;
    };
  }> {
    const token = this.jwtService.sign(
      {
        user_id: user_id,
        email: email,
      },
      { secret: jwtConstants.activationSecret, expiresIn: '30d' },
    );
    const decoded = this.jwtService.decode(token);
    const iat = decoded['iat']; // tiempo en que se emitió
    const exp = decoded['exp']; // tiempo de expiración
    const iatDate = new Date(iat * 1000);
    const expDate = new Date(exp * 1000);
    return {
      token: token,
      decoded: this.jwtService.decode(token),
      expDate,
      iatDate,
    } as {
      token: string;
      iatDate: Date;
      expDate: Date;
      decoded: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
      };
    };
  }

  async generateActivationToken(user_id: string, email: string) {
    try {
      const tokenTypes = TokenTypeEnum;
      const oldTokenData = await this.getTokenByUserId(user_id);
      if (oldTokenData && oldTokenData.token) {
        await this.revokeTokenByToken(
          oldTokenData.token,
          tokenTypes.ACTIVATION,
          user_id,
        );
      }
      const tokenData = await this.generateToken(user_id, email);
      await this.insertToken(
        user_id,
        tokenTypes.ACTIVATION,
        tokenData.token,
        tokenData.expDate.getTime(),
      );
      await this.sendActivationEmail(email, tokenData.token);
      console.log(tokenData.token);
      return tokenData.token;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async insertToken(
    user_id: string,
    type: TokenTypeEnum,
    token: string,
    expiresAt: number,
  ) {
    try {
      const exp = new Date(expiresAt * 1000);
      const rev = new Date(0);
      await this.tokenRepository.save({
        user_id,
        type,
        token,
        expires_at: exp,
        revoked_at: rev,
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async revokeTokenByToken(
    token: string,
    type: TokenTypeEnum = null,
    user_id: string = null,
  ) {
    try {
      const result = await this.tokenRepository.update(
        { token, type, user_id },
        { revoked_at: new Date() },
      );

      if (result.affected > 0) {
        return true;
      } else {
        throw new NotFoundException();
      }
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getToken(token: string) {
    try {
      const foundToken = await this.tokenRepository.findOne({
        where: { token },
      });

      if (foundToken) {
        return foundToken;
      } else {
        throw new NotFoundException();
      }
    } catch (e) {
      console.log(e, 'getToken');
      throw new InternalServerErrorException();
    }
  }

  async getTokenByUserId(user_id: string): Promise<Token> {
    try {
      // Utiliza el método findOne de TypeORM
      const foundToken = await this.tokenRepository.findOne({
        where: { user_id, revoked_at: LessThan(new Date()) },
      });

      if (foundToken) {
        return foundToken;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e, 'getTokenByEmail');
      throw new BadRequestException();
    }
  }

  async activation(token: string) {
    try {
      const verifyRes = this.jwtService.verify<{ email: string }>(token, {
        secret: jwtConstants.activationSecret,
      });

      await this.userService.activateUser(verifyRes.email);
    } catch (e) {
      if (e.constructor.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  async sendActivationEmail(to: string, token: string) {
    const activateLink = `${this.appUrl}/auth/activation/${token}`;

    try {
      await this.mailerService.sendMail({
        to,
        from: ` "Nkodex" <  ${this.configService.get('MAIL_FROM')} >`,
        subject: 'Nkodex - Account Activation - DEV',
        template: 'activation',
        context: {
          activateLink,
        },
      });
    } catch (error) {
      console.error('Error sending activation email:', error);
      throw new InternalServerErrorException('Error sending activation email');
    }
  }
}
