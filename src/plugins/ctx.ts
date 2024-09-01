import type { Request, NextFunction } from 'express'
import type { Response } from '../@types/express';

export default function (req: Request, res: Response, next: NextFunction) {
  req.paging = function () {
    return { limit: 10, page: 1, page_size: 20 }
  };
  res.success = function (data: any) {
    res.json(data);
  }
  res.fail = function (message: string, code?: number) {
    res.end({ code: code || -1, message });
  }
  next();
}