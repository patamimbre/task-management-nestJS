import { JwtPayload } from './jtw.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSerialized } from './user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MySuperSecretKey', // TODO(env) move to env
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
