import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenTypeEnum } from './types/token-type.enum/token-type.enum';
import { PoolClient } from 'pg';
import { TokensDto } from './dto/tokens.dto/tokens.dto';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { jwtConstants } from './constants/constants';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @Inject('PG_CONNECTION') private dbClient: PoolClient,
  ) {}

  async register(payload: CreateUserDto) {
    // const user = await this.userService.create(payload);
    await this.mailerService.sendMail({
      to: 'nlopezg87@gmail.com',
      from: 'noreply@nkodex.dev',
      subject: 'Activation',
      template: 'activation-email-template',
      context: {
        activateLink: 'http://localhost:3000/activation/121212',
      },
    });
  }

  async login(email: string, password: string, confirmation: string) {
    try {
      if (password !== confirmation) {
        throw new UnauthorizedException('Passwords do not match');
      }
      const user = await this.userService.findOneByEmail(email);
      const passwordMatch = new Promise<boolean>((resolve, reject) => {
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
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(accessToken: string): Promise<{ refreshToken: string }> {
    let tokenPayload = this.jwtService.verify(accessToken, {
      secret: jwtConstants.accessSecret,
    });
    const token = this.jwtService.sign(
      {
        email: tokenPayload.email,
        subject: tokenPayload.subject,
      },
      {
        secret: jwtConstants.refreshSecret,
      },
    );
    tokenPayload = this.jwtService.verify(token, {
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
  }

  async logout(refreshToken): Promise<void> {
    console.log('');
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
}
