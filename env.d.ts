import { Request as RequestBase,Response } from 'express';

declare module 'express-serve-static-core' {
  interface Response {
    success(data?: any): void;
    fail(message?: string, code?: number): void;
  }
}

declare global {
  namespace Express {
    interface Request extends RequsetBase {
      paging(): { limit: number, page: number, limit: number };
    };
  }
}

declare module "bun" {
  interface Env {
    PORT: string;
    STATIC_DIR: string;
    DATABASE_DIR: string;
  }
}

export {};