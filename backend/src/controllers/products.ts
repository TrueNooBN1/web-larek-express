import { NextFunction, Request, Response } from 'express';
import product, { IProduct } from '../models/product';
import ServerError from '../errors/server-error';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
  console.log("getProducts");
  return product.find({})
  .then((products)=>{
    res.status(200).send({"items": products, "total": products.length});
  })
  .catch((err)=>{
    console.log(err);
    return next(new ServerError(`DB error->${err.code}`));
  })
};

export const postProduct = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const newProduct : IProduct = body;

  if(newProduct === undefined || newProduct === null)
    return next(new BadRequestError("product required in body"))

  console.log(newProduct);
  return product.create(newProduct)
  .then((product)=>{
    res.status(201).send(product);
  })
  .catch((err)=>{
    if(err.code === 11000){
      return next(new ConflictError("Продукт с таким названием уже есть в системе"));
    }else{
      return next(new BadRequestError("Переданы некорректные данные при создании товара"));
    }
  })
};