import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import user from '../models/user';
import UnauthorizedError from '../errors/unauthorized-error';
import { generateTokens, setCookieObj, setExpiredCookieObj } from '../middlewares/auth';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import ServerError from '../errors/server-error';
import NotFoundError from '../errors/not-found-error';

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return user.findOne({ email }).select('+password')
    .then((findedUser) => {
      if (!findedUser) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, findedUser.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError('Неправильные почта или пароль'));
        }

        const { accessToken, refreshToken } = generateTokens(String(findedUser._id));
        setCookieObj(res, refreshToken.token);

        findedUser.set('tokens', [accessToken, refreshToken]);
        return findedUser.save()
          .then((savedUser) => {
            res.status(200).send({
              user: {
                email: savedUser.email,
                name: savedUser.name,
              },
              succes: true,
              accessToken: accessToken.token,
            });
          });
      });
    })
    .catch(() => next(new UnauthorizedError('Неправильные почта или пароль')));
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  // console.log("register incomming");
  const { email, password, name } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => user.create({ email, password: hash, name })
      .then((findedUser) => {
        const { accessToken, refreshToken } = generateTokens(String(findedUser._id));
        setCookieObj(res, refreshToken.token);
        findedUser.set('tokens', [accessToken, refreshToken]);
        findedUser.save()
          .then(() => {
            res.status(201).send({
              user: {
                email: findedUser.email,
                name: findedUser.name,
              },
              succes: true,
              accessToken: accessToken.token,
            });
          });
      })
      .catch((err) => {
      // console.log(err.code);
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким именем уже зарегестрирован'));
        }
        return next(new BadRequestError('Ошибка при добавлении'));
      }));
};

export const getToken = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken: refreshTokenHeader } = req.cookies;
  return user.findOne({
    tokens: {
      $elemMatch: {
        token: refreshTokenHeader,
      },
    },
  })
    .then((findedUser) => {
      if (findedUser === null) { return next(new UnauthorizedError('токен не найден')); }

      const { accessToken, refreshToken } = generateTokens(String(findedUser._id));
      findedUser.set('tokens', [accessToken, refreshToken]);
      return findedUser.save()
        .then(() => {
          setCookieObj(res, refreshToken.token);
          res.status(200).send({
            user: {
              email: findedUser.email,
              name: findedUser.name,
            },
            succes: true,
            accessToken: accessToken.token,
          });
        });
    })
    .catch(() => next(new ServerError('Ошибка сервера')));
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;
  // console.log(refreshToken);
  return user.findOne({
    tokens: {
      $elemMatch: {
        token: refreshToken,
      },
    },
  })
    .then((findedUser) => {
    // console.log(`user is ${user}`);
      if (findedUser === null) { return next(new UnauthorizedError('токен не найден')); }

      findedUser.set('tokens', []);
      return findedUser.save()
        .then(() => {
          setExpiredCookieObj(res, refreshToken);
          res.status(200).send({
            succes: true,
          });
        });
    })
    .catch(() => next(new ServerError('Ошибка сервера')));
};

export const getUser = (req: Request, res: Response, next: NextFunction) => user.findOne({
  _id: req.body.userId,
})
  .then((findedUser) => {
    // console.log(user);
    if (!findedUser) { return next(new NotFoundError('Пользователь не найден')); }
    return res.status(200).send({
      user: {
        email: findedUser.email,
        name: findedUser.name,
      },
      succes: true,
    });
  });
