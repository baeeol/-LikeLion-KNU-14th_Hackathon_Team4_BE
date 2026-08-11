import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(12)
  nickname: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
