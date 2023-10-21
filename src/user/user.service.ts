import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UserErrorMessages } from './constant/common/user-error-messages';
import { User } from './dto/user.dto/userDto';
import { UserStatusEnum } from './enums/user-enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create<T>(payload: CreateUserDto): Promise<User> {
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);

      const newUser = this.userRepository.create({
        email: payload.email.toLowerCase(),
        password: hashedPassword,
        username: payload.username.toLowerCase(),
        status: UserStatusEnum.NOT_VERIFIED,
        is_system_user: false,
      });

      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          UserErrorMessages.EMAIL_OR_USERNAME_ALREADY_IN_USE,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async findOneById(user_id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { user_id } });
      if (user) {
        return user;
      } else {
        throw new NotFoundException(UserErrorMessages.USER_NOT_FOUND);
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        return user;
      } else {
        throw new NotFoundException(UserErrorMessages.EMAIL_NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async updatePassword(payload: any) {
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);
      await this.userRepository.update(payload.id, {
        password: hashedPassword,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateUserStatus(user_id: string, status: string) {
    try {
      await this.userRepository.update(user_id, { status });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async activateUser(user_id: string) {
    try {
      const user = await this.findOneById(user_id);
      if (user.status !== UserStatusEnum.NOT_VERIFIED) {
        throw new BadRequestException();
      }
      await this.updateUserStatus(user_id, UserStatusEnum.ACTIVE);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(payload: any) {
    try {
      await this.userRepository.delete(payload.id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
