import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { UsersService } from './users.service';
import { NotLoggedInGuard } from '../auth/not-logged-in.guard';
import { JoinUserRequestDto } from './dto/join-user.request.dto';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { User as UserDecorator } from 'src/common/decorators/user.decorator';
import { UserResponseDto } from './dto/user.response.dto';
import { User } from 'src/common/schemas/user.schema';
import { Response } from 'express';
import { GetAllUsersQueryDto } from './dto/get-all-users.query.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login() {
    return null;
  }

  @UseGuards(NotLoggedInGuard)
  @Post('join')
  async join(@Body() dto: JoinUserRequestDto) {
    await this.usersService.create(dto);
    return null;
  }

  @UseGuards(LoggedInGuard)
  @Get('me')
  me(@UserDecorator() user: User): UserResponseDto {
    return user;
  }

  @UseGuards(LoggedInGuard)
  @Post('logout')
  async logOut(@Res() res: Response) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }

  @UseGuards(LoggedInGuard)
  @Post('signout')
  async signOut(@UserDecorator('email') email: string, @Res() res: Response) {
    await this.usersService.remove(email);
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }

  @UseGuards(LoggedInGuard)
  @Post('block')
  async block(@UserDecorator('email') email: string, @Res() res: Response) {
    await this.usersService.block(email);
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }

  @UseGuards(AdminGuard)
  @Get('all')
  async getAll(@Query() query: GetAllUsersQueryDto) {
    return this.usersService.findAll(query);
  }
}
