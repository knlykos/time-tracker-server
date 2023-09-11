import {
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
import { TokensDto } from './dto/tokens.dto/tokens.dto';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { jwtConstants } from './constants/constants';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ConfigService } from '@nestjs/config';
import { AuthenticationErrors } from './constants/auth-error-messages';
import { UserEntity } from './entity/user.entity/user.entity';
import { Client } from 'cassandra-driver';
import { UserStatusEnum } from '../user/enums/user-enums';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../common/response-types/api.response';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @Inject('PLANT43_DB_CASSANDRA') private dbClient: Client,
    private readonly configService: ConfigService,
  ) {}

  async sendActivationEmail() {}

  async signUp(payload: CreateUserDto) {
    const userId = uuidv4();
    try {
      const foundUser = await this.userService.findOneByEmail(payload.email);
      if (foundUser) {
        return new ApiResponse<void>(
          AuthenticationErrors.ACCOUNT_ALREADY_ACTIVE,
        );
      }
    } catch (e) {}
    // try {
    //   const appUrl = this.configService.get('APP_URL');
    //   const activationToken = this.jwtService.sign(
    //     {
    //       email: payload.email,
    //     },
    //     { secret: jwtConstants.activationSecret, expiresIn: '1d' },
    //   );
    //   this.insertToken()
    // } catch (e) {}
    // const promise = new Promise<void>(async (resolve, reject) => {
    //   try {
    //     const appUrl = this.configService.get('APP_URL');
    //     const activationToken = this.jwtService.sign(
    //       {
    //         email: payload.email,
    //       },
    //       { secret: jwtConstants.activationSecret, expiresIn: '30d' },
    //     );
    //
    //     await this.userService.create(userId, payload);
    //     await this.mailerService.sendMail({
    //       to: 'nlopezg87@gmail.com',
    //       from: 'noreply@nkodex.dev',
    //       subject: 'Activation',
    //       template: 'activation',
    //       context: {
    //         activateLink: `${appUrl}/auth/activation/${activationToken}`,
    //       },
    //     });
    //     resolve();
    //   } catch (e) {
    //     reject(e);
    //   }
    // });
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return await new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
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
        const expirationDate = new Date(tokenPayload.exp * 1000);

        // tokenPayload.exp
        await this.insertToken(
          tokenPayload.subject,
          type.ACCESS,
          token,
          expirationDate,
          new Date(0),
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
        type.REFRESH,
        token,
        expirationDate,
        new Date(0),
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
    return { token: token, decoded: this.jwtService.decode(token) } as {
      token: string;
      decoded: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
      };
    };
  }

  async insertToken(
    userId: string,
    type: TokenTypeEnum,
    token: string,
    expiresAt: Date,
    revokedAt: Date,
  ) {
    try {
      const result = await this.dbClient.execute(
        `INSERT INTO tokens (user_id, type, "token", expires_at, revoked_at)
         values (?, ?, ?, ?, ?);`,
        [userId, type, token, expiresAt, revokedAt],
      );
      console.log(result);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async revokeTokenByToken(
    token: string,
    type: TokenTypeEnum = null,
    userId: string = null,
  ) {
    try {
      const res = await this.dbClient.execute(
        `update tokens
         set revoked_at = ?
         where "token" = ?
           AND type = ?
           AND user_id = ?;
        `,
        [new Date(), token, type, userId],
      );
      if (res.wasApplied()) {
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
      const res = await this.dbClient.execute(
        `select *
         from tokens
         where "token" = ?;`,
        [token],
      );
      if (res.rowLength > 0) {
        return res.rows[0];
      } else {
        throw new NotFoundException();
      }
    } catch (e) {
      throw new InternalServerErrorException();
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
}
