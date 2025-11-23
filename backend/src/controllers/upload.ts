import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import ServerError from '../errors/server-error';

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new ServerError('No file uploaded'));
  }

  const extension = path.extname(req.file.originalname);

  const basePath = path.join(req.file.destination, req.file.filename);
  const relativePath = `/temp/${req.file.filename}${extension}`;
  const fileName = req.file.filename;

  return fs.rename(basePath, basePath + extension)
    .then(() => res.status(200).send({
      fileName: relativePath,
      originalName: fileName + extension,
    }))
    .catch(() => next(new ServerError('file rename error')));
};

export default uploadFile;
