import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../auth/entity/user.entity/user.entity';
import { JwtRefreshAuthGuard } from '../auth/guards/jwt-refresh-auth/jwt-refresh-auth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtRefreshAuthGuard)
  create(@User() user: UserEntity, @Body() createProjectDto: CreateProjectDto) {
    try {
      return this.projectService.create(createProjectDto, user.subject);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  @Get()
  @UseGuards(JwtRefreshAuthGuard)
  findAll(@User() user: UserEntity) {
    try {
      return this.projectService.findAll(user.subject);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  @UseGuards(JwtRefreshAuthGuard)
  findOne(@User() user: UserEntity, @Param('id') id: number) {
    try {
      return this.projectService.findOne(+id, +user.subject);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @UseGuards(JwtRefreshAuthGuard)
  update(
    @User() user: UserEntity,
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    try {
      return this.projectService.update(+id, updateProjectDto, user.subject);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  @Delete(':id')
  @UseGuards(JwtRefreshAuthGuard)
  remove(@User() user: UserEntity, @Param('id') id: string) {
    try {
      return this.projectService.remove(+id, user.subject);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }
}
