// https://github.com/notiz-dev/nestjs-prisma/blob/main/lib/prisma-client-exception.filter.ts

import {
  ArgumentsHost,
  Catch,
  ContextType,
  HttpException,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

export declare type GqlContextType = 'graphql' | ContextType;

export type ErrorCodesMapping = {
  [key: string]: {
    statusCode: number;
    message: string;
  };
};

@Catch(Prisma?.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private errorCodesMapping: ErrorCodesMapping = {
    P2000: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid input',
    },
    P2002: {
      statusCode: HttpStatus.CONFLICT,
      message: 'Conflict',
    },
    P2025: {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Not found',
    },
  };

  constructor(
    applicationRef?: HttpServer,
    errorCodesMapping: ErrorCodesMapping = null,
  ) {
    super(applicationRef);

    if (errorCodesMapping) {
      this.errorCodesMapping = Object.assign(
        this.errorCodesMapping,
        errorCodesMapping,
      );
    }
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const { statusCode, message } = this.errorCodesMapping[exception.code];

    if (host.getType() === 'http') {
      // for http requests (REST)
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      if (!Object.keys(this.errorCodesMapping).includes(exception.code)) {
        return super.catch(exception, host);
      }

      response.status(statusCode).send(JSON.stringify({ statusCode, message }));
    } else if (host.getType<GqlContextType>() === 'graphql') {
      // for graphql requests
      if (!Object.keys(this.errorCodesMapping).includes(exception.code)) {
        return exception;
      }

      return new HttpException({ statusCode, message }, statusCode);
    }
  }
}
