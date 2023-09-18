import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../common/response-types/api.response';
import { ApiResponseInterceptor } from '../common/api-response/api-response.interceptor';
import { UserMessages } from './constant/common/user-messages';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ApiResponseInterceptor)
  @Post()
  async create(@Body() user: CreateUserDto, @Res() res: Response) {
    // const apiResponse = new ApiResponse();
    try {
      await this.userService.create(user);
      const apiResponse = ApiResponse.created(UserMessages.USER_CREATED);
      res.status(apiResponse.getStatus()).json(apiResponse);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: string) {
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
