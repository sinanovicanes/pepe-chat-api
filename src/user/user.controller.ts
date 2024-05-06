import { Body, Controller, Inject, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dtos/UpdateUserDto';

@Controller('users')
export class UserController {
  @Inject() private readonly userService: UserService;

  @UseGuards(AuthGuard('local'))
  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }
}
