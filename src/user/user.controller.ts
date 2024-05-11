import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/database/schemas/user.schema';
import { JwtGuard } from 'src/auth/guards/jwt.auth.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Inject() private readonly userService: UserService;

  @Patch()
  updateUser(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(user, updateUserDto);
  }

  @Get('chats')
  getUserChatList(@AuthUser() user: User) {
    return this.userService.getUserChatList(user);
  }
}
