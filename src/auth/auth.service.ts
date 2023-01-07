import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor(private jwtService: JwtService) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  verifyToken(rawAccessToken: string): { sub: number } {
    const accessToken = rawAccessToken.replace('Bearer ', '');
    const jwtClaims = this.jwtService.verify(accessToken, {
      secret: 'qwertyuiopasdfghjklzxcvbnm123456',
    });

    jwtClaims.sub = Number(jwtClaims.sub);
    return jwtClaims;
  }
}
