import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import ServerError from '../errors/server-error';
import UnauthorizedError from '../errors/unauthorized-error';

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // console.log('errorHandler');
  // console.log(error);

  if (error instanceof ConflictError
    || error instanceof BadRequestError
    || error instanceof NotFoundError
    || error instanceof ServerError
    || error instanceof UnauthorizedError) {
    return res.status(error.statusCode).send({ message: error.message });
  }
  return res.status(404).send('');
};

export default errorHandler;
