import { Injectable, OnModuleInit, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // verifyToken(rawAccessToken: string): { sub: number } {
  //   const accessToken = rawAccessToken.replace('Bearer ', '');
  //   const jwtClaims = this.jwtService.verify(accessToken, {
  //     secret: 'qwertyuiopasdfghjklzxcvbnm123456',
  //   });
  //
  //   jwtClaims.sub = Number(jwtClaims.sub);
  //   return jwtClaims;
  // }
  async login(email: string, password: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      const signToken = new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            reject(err);
          }
          if (result) {
            const token = this.jwtService.sign({
              email: user.email,
              sub: user.id,
            });
            resolve(token);
          }
        });
      });
      const token = await signToken;
      return { accessToken: token };
    } catch (error) {
      throw error;
    }
  }
}
