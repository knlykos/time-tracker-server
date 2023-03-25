import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { JwtRefreshAuthGuard } from '../auth/guards/jwt-refresh-auth/jwt-refresh-auth.guard';
import { UserEntity } from '../auth/entity/user.entity/user.entity';
import { User } from '../auth/decorators/user.decorator';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  @UseGuards(JwtRefreshAuthGuard)
  create(@User() user: UserEntity, @Body() createLogDto: CreateLogDto) {
    return this.logService.create(createLogDto, user.subject);
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.logService.findAll(user.subject);
  }

  @Get(':id')
  findOne(@User() user: UserEntity, @Param('id') id: string) {
    return this.logService.findOne(+id, user.subject);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLogDto: UpdateLogDto,
    @User() user: UserEntity,
  ) {
    return this.logService.update(+id, updateLogDto, user.subject);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserEntity) {
    return this.logService.remove(+id, user.subject);
  }
}
