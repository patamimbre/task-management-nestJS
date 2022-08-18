import { JwtPayload } from './jtw.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ userId, username }: JwtPayload): Promise<JwtPayload> {
    const found = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!found) {
      throw new UnauthorizedException();
    }
    return { userId, username };
  }
}
