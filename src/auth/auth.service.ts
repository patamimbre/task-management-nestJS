import { JwtPayload, JwtResponse } from './jtw.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserSerialized } from './user.model';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signupUserDto: SignUpUserDto): Promise<UserSerialized> {
    const hashedPassword = await this.hashPassword(signupUserDto.password);
    const createdUser = await this.prisma.user.create({
      data: {
        ...signupUserDto,
        password: hashedPassword,
      },
    });

    const user = new UserSerialized(createdUser);
    this.logger.log(`User ${user.username} signed up`, user);
    return user;
  }

  async signIn({ username, password }: SignInUserDto): Promise<JwtResponse> {
    const found = await this.prisma.user.findUnique({
      where: { username },
    });

    if (found && (await this.verifyPassword(password, found.password))) {
      this.logger.log(`User ${username} signed in`);
      return this.generateJwtToken({ userId: found.id, username });
    } else {
      this.logger.log(`User ${username} failed to sign in`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private verifyPassword(
    givenPassword: string,
    storedHash: string,
  ): Promise<boolean> {
    return argon2.verify(storedHash, givenPassword);
  }

  private generateJwtToken(payload: JwtPayload): JwtResponse {
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
