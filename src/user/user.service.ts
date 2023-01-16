import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(data: Prisma.usersCreateInput) {
    try {
      await this.prisma.users.create({
        data: {
          email: data.email,
          password: data.password,
          username: data.username,
          group_id: 1,
        },
      });
      return 'User created';
    } catch (error) {
      throw new Error('Error creating user');
    }
  }
}
