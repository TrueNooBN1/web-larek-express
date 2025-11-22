import { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';
import product, { IProduct } from '../models/product';
import ServerError from '../errors/server-error';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import { publicPath } from '../config';

const path = require('path');

export const getProducts = (_req: Request, res: Response, next: NextFunction) => product.find({})
  .then((products) => {
    res.status(200).send({ items: products, total: products.length });
  })
  .catch((err) => next(new ServerError(`DB error->${err.code}`)));

export const postProduct = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  const newProduct : IProduct = body;
  // console.log(newProduct);

  if (newProduct === undefined || newProduct === null) { return next(new BadRequestError('product required in body')); }

  if (newProduct.image) {
    const fullPath = path.join(publicPath, newProduct.image.fileName);
    fs.access(fullPath)
      .then(() => {
        const newPath = path.join(publicPath, 'images', newProduct.image.originalName);
        newProduct.image.fileName = `/images/${newProduct.image.originalName}`;
        fs.rename(fullPath, newPath)
          .then(() => {
          })
          .catch(() => next(new BadRequestError('Incorrect fileName')));
      })
      .catch(() => {});
  }

  return product.create(newProduct)
    .then((dbProduct) => {
      res.status(201).send({ ...newProduct, _id: dbProduct._id });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Продукт с таким названием уже есть в системе'));
      }
      // console.log(err);
      return next(new BadRequestError('Переданы некорректные данные при создании товара'));
    });
};

// type PartialProduct = Partial<IProduct>

export const patchProduct = (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { body } = req;
  if (body.image) {
    const fullPath = path.join(publicPath, body.image.fileName);
    const newPath = path.join(publicPath, 'images', body.image.originalName);
    body.image.fileName = `/images/${body.image.originalName}`;

    fs.rename(fullPath, newPath)
      .then(() => {
      })
      .catch(() => next(new BadRequestError('Incorrect fileName')));
  }
  return product.findByIdAndUpdate({ _id: productId }, body, { new: true })
    .then(() => {
      res.status(200).send({ ...product, _id: productId });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Продукт с таким названием уже есть в системе'));
      }
      return next(new BadRequestError('Переданы некорректные данные при создании товара'));
    });
};

export const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  return product.findOneAndDelete({ _id: productId })
    .then(() => {
      if (!product) { return next(new BadRequestError('Продукт не найден')); }
      return res.status(200).send(product);
    })
    .catch(() => next(new ServerError('Ошибка сервера')));
};
