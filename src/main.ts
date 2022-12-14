import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import NotFoundInterceptor from './not-found.interceptor';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe());

  // To convert undefined values to NotFound responses
  app.useGlobalInterceptors(new NotFoundInterceptor());

  // To convert PrismaClient exceptions to proper responses (instead of 500)
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.enableCors();
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
