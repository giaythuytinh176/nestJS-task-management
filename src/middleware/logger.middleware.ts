import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Logger Middleware Request ...');

    // console.log('req Middleware', req);
    // console.log('res Middleware', res);
    // console.log('next Middleware', next);

    next();
  }
}