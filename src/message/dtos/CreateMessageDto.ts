import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @MaxLength(250)
  @IsNotEmpty()
  message: string;
}
