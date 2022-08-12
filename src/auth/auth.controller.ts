import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signin-user.dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import { CreatedUserModel } from './user.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() signupUserDto: SignUpUserDto): Promise<CreatedUserModel> {
    return this.authService.signUp(signupUserDto);
  }

  @Post('/signin')
  signin(@Body() signinUserDto: SignInUserDto): Promise<boolean> {
    return this.authService.signIn(signinUserDto);
  }
}
