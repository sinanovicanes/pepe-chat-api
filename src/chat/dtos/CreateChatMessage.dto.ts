import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateChatMessageDto {
  @MaxLength(500)
  @IsNotEmpty()
  message: string;
}
