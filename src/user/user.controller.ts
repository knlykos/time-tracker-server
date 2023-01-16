import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { users } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async createUser(
    @Body('password') password: string,
    @Body('email') email: string,
  ): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    try {
      return await this.userService.createUser({
        email,
        password: hashedPassword,
        group_id: 2,
        username: email,
      });
    } catch (error) {}
  }
}
