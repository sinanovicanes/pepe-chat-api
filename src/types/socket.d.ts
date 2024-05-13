import { Socket } from 'socket.io';
import { User } from 'src/database/schemas/user.schema';

interface AuthenticatedSocket extends Socket {
  user: User;
}
