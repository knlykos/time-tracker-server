import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../common/response-types/api.response';
import { ApiResponseInterceptor } from '../common/api-response/api-response.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ApiResponseInterceptor)
  @Post()
  async create(@Body() user: CreateUserDto) {
    // const apiResponse = new ApiResponse();
    const userId = uuidv4();
    try {
      const foundUser = await this.userService.findOneByEmail(user.email);
      if (foundUser) {
        return new ApiResponse<void>('User already exists');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        try {
          const userWasApplied = await this.userService.create(userId, user);
          if (userWasApplied) {
            return new ApiResponse<void>('User was created');
          }
        } catch (e) {
          throw new InternalServerErrorException();
        }
      }
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
    console.log(email);
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
