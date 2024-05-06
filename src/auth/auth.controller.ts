import {
  Body,
  Controller,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { AuthService } from './auth.service';
import { User } from 'src/database/schemas/user.schema';
import { SignUpDto } from './dtos/SignUpDto';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  @Inject() private readonly authService: AuthService;

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestType) {
    return this.authService.login(req.user as Omit<User, 'password'>);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  async getProfile(@Request() req: RequestType) {
    return req.user;
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
