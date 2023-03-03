import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: CreateUserDto) {
    try {
      return await this.userService.create(user);
    } catch (error) {
      throw error;
    }
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: number) {
    try {
      return await this.userService.findOneById(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    try {
      return await this.userService.findOneByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async updateById(@Param('id') id: number, @Body() user: any) {
    try {
      return await this.userService.updatePassword(user);
    } catch (error) {
      throw error;
    }
  }
}
