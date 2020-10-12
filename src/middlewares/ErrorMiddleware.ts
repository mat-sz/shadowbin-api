import { Context } from 'koa';
import {
  Middleware,
  KoaMiddlewareInterface,
  HttpError,
} from 'routing-controllers';

@Middleware({ type: 'before', priority: 999 })
export class ErrorMiddleware implements KoaMiddlewareInterface {
  async use(context: Context, next: (err?: any) => Promise<any>): Promise<any> {
    try {
      await next();
    } catch (error) {
      const status = error instanceof HttpError ? error.httpCode : 500;
      context.response.status = status;
      context.response.body = JSON.stringify({
        httpCode: status,
        success: false,
        error: {
          message: error.message,
        },
      });
    }
  }
}
