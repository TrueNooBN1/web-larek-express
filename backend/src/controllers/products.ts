import { NextFunction, Request, Response } from 'express';
import product, { IProduct } from '../models/product';
import ServerError from '../errors/server-error';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import fs from "fs/promises"
import { publicPath } from '../config';

const path = require("path");

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
  return product.find({})
  .then((products)=>{
    res.status(200).send({"items": products, "total": products.length});
  })
  .catch((err)=>{
    // console.log(err);
    return next(new ServerError(`DB error->${err.code}`));
  })
};

export const postProduct = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const newProduct : IProduct = body;

  if(newProduct === undefined || newProduct === null)
    return next(new BadRequestError("product required in body"))

  if(newProduct.image){
    const fullPath = path.join(publicPath, newProduct.image.fileName);
    const newPath = path.join(publicPath, "images", newProduct.image.originalName);
    newProduct.image.fileName = "/images/"+newProduct.image.originalName
    fs.rename(fullPath, newPath)
    .then(()=>{
    })
    .catch(err=>{
      return next(new BadRequestError("Incorrect fileName"))
    })
  }

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

type PartialProduct = Partial<IProduct>

export const patchProduct = (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId;
  const body:PartialProduct = req.body;
  if(body.image){
    const fullPath = path.join(publicPath, body.image.fileName);
    const newPath = path.join(publicPath, "images", body.image.originalName);
    body.image.fileName = "/images/"+body.image.originalName

    fs.rename(fullPath, newPath)
    .then(()=>{
    })
    .catch(err=>{
      next(new BadRequestError("Incorrect fileName"))
    })
  }
  product.findByIdAndUpdate({_id: productId},body,{new: true})
  .then((product)=>{
    res.status(201).send(product);
  })
  .catch(err=>{
    if(err.code === 11000){
      return next(new ConflictError("Продукт с таким названием уже есть в системе"));
    }else{
      return next(new BadRequestError("Переданы некорректные данные при создании товара"));
    }
  })
};

export const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId;
  product.findOneAndDelete({_id: productId})
  .then((product)=>{
    if(!product)
      return next(new BadRequestError("Продукт не найден"));
    res.status(201).send(product);
  })
};

