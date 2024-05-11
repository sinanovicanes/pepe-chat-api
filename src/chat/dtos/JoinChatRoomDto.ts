import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class JoinChatRoomDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  roomName: string;
}
