import { Request, Express } from 'express';
import multer from 'multer';
import BadRequestError from '../errors/bad-request-error';
import { uploadPath } from '../config';

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only images allowed'));
  }
};

const fileMiddleware = multer({
  dest: uploadPath,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter,
});

export default fileMiddleware;
