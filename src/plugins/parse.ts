import type { Request, Response, NextFunction } from 'express'
import _ from 'lodash';
import jwt from 'jsonwebtoken'
import config from 'config';

export default async function parse(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization || req.cookies.authorization || req.body?.authorization || '';
    const [type, token] = authorization.split(' ');
    if (type === 'Bearer') {
      const data = jwt.verify(token, config.jwt_key)
      res.locals.user = data;
      res.locals.isLogin = true;
    }
  } catch (e: any) {
    if (e.name === 'TokenExpiredError') {
      return res.fail('token已过期!', 101010,)
    }
    res.locals.isLogin = false;
    res.locals.user = { id: "" };
  }
  next();
}