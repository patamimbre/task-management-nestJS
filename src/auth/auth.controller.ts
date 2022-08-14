import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signin-user.dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import { GetUser } from './get-user.decorator';
import { JwtResponse } from './jtw.interface';
import { UserSerialized } from './user.model';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() signupUserDto: SignUpUserDto): Promise<UserSerialized> {
    return this.authService.signUp(signupUserDto);
  }

  @Post('/signin')
  signin(@Body() signinUserDto: SignInUserDto): Promise<JwtResponse> {
    return this.authService.signIn(signinUserDto);
  }
}
