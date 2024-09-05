import type { Request, Response, NextFunction } from 'express'
import _ from 'lodash';

export default function (req: Request, res: Response, next: NextFunction) {
  req.paging = function () {
    return { limit: 10, page: 1, page_size: 20 }
  };
  res.success = function (data: any) {
    const result: { code: number, message: string, data?: any } = {
      code: 0,
      message: '',
    }
    if (!_.isNil(data)) {
      result.data = data;
    }
    res.json(result);
  }
  res.fail = function (message: string, code?: number) {
    res.json({ code: code || -1, message });
  }
  next();
}