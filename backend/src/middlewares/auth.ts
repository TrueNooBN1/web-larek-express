import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_ACCESS_TOKEN_EXPIRY, AUTH_REFRESH_TOKEN_EXPIRY, JWT_ACCES_KEY, JWT_REFRESH_KEY } from '../config';
import UnauthorizedError from '../errors/unauthorized-error';
import { IToken} from '../models/user';

const ms = require('ms')

interface JwtPayload {
  _id: string;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization header is required'));
  }

  const token = authHeader!.split(' ')[1];
  if (!token) {
    return next(new UnauthorizedError('Access token is required'));
  }

  try{
    const decoded = jwt.verify(token, String(JWT_ACCES_KEY)) as JwtPayload;
    // console.log(decoded._id);
    req.body.userId = decoded._id;
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Access token expired'));
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid access token'));
    }
    
    return next(error);
  }
};

export const generateTokens = (userId: string) => {
      const accessToken = jwt.sign({ _id: userId }, String(JWT_ACCES_KEY),{ expiresIn: ms(AUTH_ACCESS_TOKEN_EXPIRY) });
      const refreshToken = jwt.sign({ _id: userId }, String(JWT_REFRESH_KEY), { expiresIn: ms(AUTH_REFRESH_TOKEN_EXPIRY)});
      const accessTokenObj : IToken = {
        token: accessToken,
      }
      const refreshTokenObj : IToken = {
        token: refreshToken,
      }
      return {accessToken: accessTokenObj, refreshToken:refreshTokenObj};
}; 

export const setCookieObj = (res: Response, refreshToken: string) => {
      const cookie = {
        name: 'refreshToken',
        options: {
          httpOnly: true,
          sameSite: 'lax' as const,
          secure: false,
          maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
          path: '/',
        }
      };
      res.cookie(cookie.name, refreshToken, cookie.options);
}; 

export const setExpiredCookieObj = (res: Response, refreshToken: string) => {
      const cookie = {
        name: 'refreshToken',
        options: {
          httpOnly: true,
          sameSite: 'lax' as const,
          secure: false,
          maxAge: -1,
          path: '/',
        }
      };
      res.cookie(cookie.name, refreshToken, cookie.options);
}; 

