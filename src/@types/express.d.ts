import type {
  Request as RequestBase,
  Response as ResponseBase,
  NextFunction,
} from 'express';

declare global {
  namespace Express {
    interface Request extends RequsetBase {
      paging(): { limit: number, page: number, limit: number };
    };
    interface Response extends ResponseBase {
      success(data: any): void;
      fail(message: string, code?: number): void;
    };
    interface Next extends NextFunction {

    };
  }
}
