import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateChatRoomDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  name: string;
}
