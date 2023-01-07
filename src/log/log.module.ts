import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LogController],
  providers: [LogService, PrismaService, AuthService, JwtService],
  exports: [PrismaService, AuthService],
})
export class LogModule {}
