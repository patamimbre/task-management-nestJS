import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatedUserModel } from './user.model';
import * as argon2 from 'argon2';
import { SignInUserDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private verifyPassword(
    givenPassword: string,
    storedHash: string,
  ): Promise<boolean> {
    return argon2.verify(storedHash, givenPassword);
  }

  async signUp(signupUserDto: SignUpUserDto): Promise<CreatedUserModel> {
    const hashedPassword = await this.hashPassword(signupUserDto.password);
    const { username, createdAt } = await this.prisma.user.create({
      data: {
        ...signupUserDto,
        password: hashedPassword,
      },
    });

    return { username, createdAt };
  }

  async signIn({ username, password }: SignInUserDto): Promise<boolean> {
    const found = await this.prisma.user.findUnique({
      where: { username },
    });

    const isValid =
      found && (await this.verifyPassword(password, found.password));

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return true;
  }
}
