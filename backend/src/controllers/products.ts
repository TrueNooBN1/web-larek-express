import { Request, Response } from 'express';
import product from '../models/product';

export const getProducts = (req: Request, res: Response) => {
  console.log("getProducts");
  try{
    return product.find({})
    .then((products)=>{
      res.status(200).send({"items": products, "total": products.length});
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).send({
        "message": "ошибка по умолчанию"
      });
    })
  }catch(err){
      res.status(500).send({
        "message": "ошибка по умолчанию"
      });
    console.log(err);
  }
};
export const postProduct = (req: Request, res: Response) => {
  const body = req.body;
  const newProduct = body; 
  console.log("postProduct", body);
  try{
    return product.create(newProduct)
    .then((product)=>{
      res.status(201).send(product);
    })
    .catch((err)=>{
      console.log("postProduct DB error->", err);
      if(err.code === 11000){
        res.status(409).send({
          "message": "Продукт с таким названием уже есть в системе"
        });
      }else{
        res.status(500).send({
          "message": "ошибка по умолчанию"
        });
      }
    res.status(500).send({
      "message": "ошибка по умолчанию"
    });
    })
  }catch(err){
      console.log("postProduct error->", err);
    res.status(500).send({
      "message": "ошибка по умолчанию"
    });
  }
};