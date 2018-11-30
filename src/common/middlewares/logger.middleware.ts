import { Middleware, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

@Middleware()
export class LoggerMiddleware implements NestMiddleware {
  resolve(name: string): MiddlewareFunction {
    return (req, res, next) => {
      console.log(`[${name}] Middleware...`); // [ApplicationModule] Request...
      next();
    };
  }
}
