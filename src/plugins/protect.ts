import type { Request, Response, NextFunction } from 'express'

export default function protect(req: Request, res: Response, next: NextFunction) {
  if (res.locals.isLogin) {
    next();
  } else {
    res.fail('请先登录')
  }
}