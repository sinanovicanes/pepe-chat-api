import {
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MaxLength(32)
  @MinLength(6)
  @IsStrongPassword()
  password?: string;

  @IsOptional()
  @IsString()
  @IsUrl({})
  avatar?: string;
}
