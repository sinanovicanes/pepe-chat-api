import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dtos/SignUpDto';

@Injectable()
export class AuthService {
  @Inject() private readonly userService: UserService;
  @Inject() private readonly jwtService: JwtService;

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findUserByUsername(username);

    if (!user || !(await bcrypt.compare(pass, user.password))) return null;

    user.password = undefined;

    return user;
  }

  async login(user: Omit<User, 'password'>) {
    return {
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      accessToken: this.jwtService.sign({
        username: user.username,
        sub: user._id,
      }),
    };
  }

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<Partial<User> & { id: User['_id']; accessToken: string }> {
    const { password } = signUpDto;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser({
      ...signUpDto,
      password: passwordHash,
    });

    return {
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      accessToken: this.jwtService.sign({
        username: user.username,
        sub: user._id,
      }),
    };
  }
}
