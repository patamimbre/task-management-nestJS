import { IsString, IsNotEmpty } from 'class-validator';

export class SignInUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
