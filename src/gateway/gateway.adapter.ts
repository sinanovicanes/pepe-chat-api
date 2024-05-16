import { INestApplicationContext, Inject } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/database/schemas/user.schema';
import { AuthenticatedSocket } from 'src/types/socket';

export class WebsocketAdapter extends IoAdapter {
  @Inject() private authService: AuthService;

  constructor(private app: INestApplicationContext) {
    super(app);

    app
      .resolve<AuthService>(AuthService)
      .then((service) => (this.authService = service));
  }

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);

    server.use(async (socket: AuthenticatedSocket, next) => {
      const { authorization } = socket.handshake.headers;

      if (!authorization) {
        return next(new Error('Authorization header not found!'));
      }

      const token = authorization.split(' ')[1];

      try {
        const user = (await this.authService.validateUserByToken(
          token,
        )) as User;

        if (!user) return next(new Error('User not found'));

        socket.user = user;
      } catch {
        next(new Error('Authorization failed'));
      }

      next();
    });
    return server;
  }
}
