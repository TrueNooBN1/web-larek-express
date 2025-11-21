import { NextFunction, Request, Response } from 'express';
import ServerError from '../errors/server-error';
import path from 'path';

const fs = require('fs');

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new ServerError('No file uploaded'));
  }

  const extension = path.extname(req.file.originalname);

  const basePath = path.join(req.file.destination, req.file.filename);
  const relativePath = "/temp/"+ req.file.filename + extension;
  
  await fs.rename(basePath, basePath + extension, (error:Error, res: Response, req: Request)=>{
    if(error)
      return next(new ServerError("file rename error"));

  })
  
  res.status(200).send({
    fileName: relativePath,
    originalName: req.file.filename + extension
  });
};