import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenTypeEnum } from './types/token-type.enum/token-type.enum';
import { PoolClient } from 'pg';
import { TokensDto } from './dto/tokens.dto/tokens.dto';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { jwtConstants } from './constants/constants';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ConfigService } from '@nestjs/config';
import { AuthenticationErrors } from './constants/auth-error-messages';
import { UserEntity } from './entity/user.entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @Inject('PG_CONNECTION') private dbClient: PoolClient,
    private readonly configService: ConfigService,
  ) {}

  async register(payload: CreateUserDto) {
    if (payload.password !== payload.confirmation) {
      throw new UnauthorizedException(
        AuthenticationErrors.PASSWORDS_DO_NOT_MATCH,
      );
    }
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const appUrl = this.configService.get('APP_URL');
        const activationToken = this.jwtService.sign(
          {
            email: payload.email,
          },
          { secret: jwtConstants.activationSecret, expiresIn: '30d' },
        );

        await this.mailerService.sendMail({
          to: 'nlopezg87@gmail.com',
          from: 'noreply@nkodex.dev',
          subject: 'Activation',
          template: 'activation',
          context: {
            activateLink: `${appUrl}/auth/activation/${activationToken}`,
          },
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
    await this.userService.create<void>(payload, promise);
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
          subject: user.id,
        });

        const tokenPayload = this.jwtService.verify(token);
        const type = TokenTypeEnum;
        const expirationDate = new Date(tokenPayload.exp * 1000);

        // tokenPayload.exp
        await this.insertToken(
          tokenPayload.subject,
          type.Access,
          token,
          expirationDate,
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
      const expirationDate = new Date(tokenPayload.exp * 1000);
      await this.insertToken(
        tokenPayload.subject,
        type.Refresh,
        token,
        expirationDate,
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

  async insertToken(
    userId: number,
    type: TokenTypeEnum,
    token: string,
    expires_at: Date,
  ) {
    try {
      const revoked_at = new Date(0);
      await this.dbClient.query<TokensDto>(
        `insert into tokens (user_id, type, token, expires_at, revoked_at)
         values ($1, $2, $3, $4, $5);`,
        [userId, type, token, expires_at, revoked_at],
      );
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async revokeTokenByToken(token: string) {
    await this.dbClient.query<TokensDto>(
      `update tokens
       set revoked_by = 1,
           is_revoked = true
       where token = $1;
      `,
      [token],
    );
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
}
