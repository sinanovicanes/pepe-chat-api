import { IoAdapter } from '@nestjs/platform-socket.io';
import { Socket } from 'socket.io';
import { INestApplicationContext, Inject } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthenticatedSocket } from 'src/types/socket';
import { User } from 'src/database/schemas/user.schema';

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
        return next(new Error('Not Authenticated. No cookies were sent'));
      }

      const token = authorization.split(' ')[1];

      try {
        const retVal = await this.authService.validateToken(token);
        const user = (await this.authService.validateUserById(
          retVal.sub,
        )) as User;

        if (!user) return next(new Error('User not found'));

        socket.user = user;
      } catch {
        next(new Error('Authorization faield'));
      }

      next();
    });
    return server;
  }
}
