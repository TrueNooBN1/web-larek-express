import { NextFunction, Request, Response } from 'express';
import user from '../models/user';
import UnauthorizedError from '../errors/unauthorized-error';
import bcrypt from 'bcryptjs'
import { generateTokens, setCookieObj, setExpiredCookieObj } from '../middlewares/auth';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import ServerError from '../errors/server-error';
import NotFoundError from '../errors/not-found-error';

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return user.findOne({ email }).select("+password")
  .then((user) => {
    if (!user) {
      next(new UnauthorizedError('Неправильные почта или пароль'))
    }
    return bcrypt.compare(password, user!.password).then((matched) => {
      if (!matched) {
        next(new UnauthorizedError('Неправильные почта или пароль'))
      }

      const {accessToken, refreshToken} = generateTokens(String(user!._id));
      setCookieObj(res, refreshToken.token);

      user!.tokens = [accessToken, refreshToken];
      user!.save()
      .then((savedUser)=>{
        res.status(200).send({
          user:{
            email: savedUser.email,
            name: savedUser.name
          },
          succes: true,
          accessToken: accessToken.token
        });
      })
    });
  })
  .catch((error)=>{
    next(new UnauthorizedError('Неправильные почта или пароль'))
  })
}

export const register = (req: Request, res: Response, next: NextFunction) => {
  console.log("register incomming");
  const { email, password, name } = req.body;
  return bcrypt.hash(password, 10)
  .then((hash)=>{
    return user.create({ email: email, password:hash, name: name})
    .then((user)=>{
      const {accessToken, refreshToken} = generateTokens(String(user._id));
      setCookieObj(res, refreshToken.token);
      user.tokens = [accessToken, refreshToken];
      user.save()
      .then((savedUser)=>{
        res.status(200).send({
          user:{
            email: user.email,
            name: user.name
          },
          succes: true,
          accessToken: accessToken.token
        });
      })
    })
    .catch(err=>{
      console.log(err.code);
      if(err.code === 11000){
        next(new ConflictError("Пользователь с таким именем уже зарегестрирован"));
      }
      next(new BadRequestError("Ошибка при добавлении"));
    })
  })
}

export const getToken = (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;
  return user.findOne({
    "tokens": {
      "$elemMatch": {
        token: refreshToken
      }
    }
  })
  .then(user=>{
    if(user === null)
      return next(new BadRequestError("токен не найден"));
    
    const {accessToken, refreshToken} = generateTokens(String(user._id));
    user!.tokens = [accessToken, refreshToken];
    user?.save()
    .then(()=>{
      setExpiredCookieObj(res, refreshToken.token);
      res.status(200).send({
        user:{
          email: user.email,
          name: user.name
        },
        succes: true,
        accessToken: accessToken.token
      });
    })
  })
  .catch(err=>{
    console.log(err);
    next(new ServerError("Ошибка сервера"));
  })
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;
  return user.findOne({
    "tokens": {
      "$elemMatch": {
        token: refreshToken
      }
    }
  })
  .then(user=>{
    if(user === null)
      next(new BadRequestError("токен не найден"));
    
    user!.tokens = [];
    user?.save()
    .then(()=>{
      setExpiredCookieObj(res, refreshToken);
      res.status(200).send({
        succes: true
      });
    })
  })
  .catch(err=>{
    console.log(err);
    next(new ServerError("Ошибка сервера"));
  })
}

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  console.log(authorization);
  const token = authorization!.split(' ')[1];

  return user.findOne({
    _id: req.body.userId
  })
  .then(user=>{
    console.log(user);
    if(!user)
      next(new NotFoundError("Пользователь не найден"));
    res.status(200).send({
      user:{
        email: user?.email,
        name: user?.name
      },
      succes: true
    });
  })
}
