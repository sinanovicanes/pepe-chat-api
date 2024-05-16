import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatMessage } from 'src/database/schemas/chat.message.schema';
import { User } from 'src/database/schemas/user.schema';
import { ChatWebsocketEvents } from 'src/enums/chat.websocket.events';
import { InternalEvents } from 'src/enums/internal.events';
import { AuthenticatedSocket } from 'src/types/socket';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log(`CHAT GATEWAY: ${socket.user.username} connected`);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log(`CHAT GATEWAY: ${socket.user.username} disconnected`);
  }

  @SubscribeMessage(ChatWebsocketEvents.JOIN)
  joinChat(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() message: string,
  ) {
    const roomName = `chat-rooms-${message}`;
    socket.join(roomName);
    this.server.to(roomName).emit('onUserJoined', {
      username: socket.user.username,
      avatar: socket.user.avatar,
      date: Date.now(),
    });
  }

  @OnEvent(InternalEvents.MESSAGE_CREATED)
  onNewMessage(payload: {
    createdMessage: ChatMessage;
    user: User;
    roomName: string;
  }) {
    const roomName = `chat-rooms-${payload.roomName}`;
    console.log(roomName);

    this.server.to(roomName).emit('newMessage', {
      _id: payload.createdMessage._id,
      date: payload.createdMessage.createdAt,
      message: payload.createdMessage.message,
      user: {
        _id: payload.user._id,
        username: payload.user.username,
        avatar: payload.user.avatar,
      },
    });
  }
}
