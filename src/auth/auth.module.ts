import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'MySuperSecretKey', // TODO(env) move to env
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
