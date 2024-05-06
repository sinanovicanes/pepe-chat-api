import {
  IsString,
  IsStrongPassword,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @MaxLength(32)
  @MinLength(6)
  @IsStrongPassword()
  password?: string;

  @IsString()
  @IsUrl({})
  avatar: string;
}
