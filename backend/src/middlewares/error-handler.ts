import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import ServerError from '../errors/server-error';
import UnauthorizedError from '../errors/unauthorized-error';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction)=>{
  
  console.log("errrorHandler");
  console.log(error);

  if (error instanceof ConflictError || 
    error instanceof BadRequestError || 
    error instanceof NotFoundError ||
    error instanceof ServerError ||
    error instanceof UnauthorizedError) {
    return res.status(error.statusCode).send({"message": error.message});
  }
  res.status(404).send(error.message);
}