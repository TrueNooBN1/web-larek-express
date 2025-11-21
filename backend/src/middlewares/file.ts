import BadRequestError from "../errors/bad-request-error";
import { uploadPath } from "../config";
import { Request, Response, NextFunction } from "express"
import multer from "multer"

const path = require('path');
const fs = require('fs');

const fileFilter = (
  req: Request, 
  file: Express.Multer.File, 
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only images allowed'));
  }
};

export const fileMiddleware = multer({
  dest: uploadPath,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: fileFilter
});