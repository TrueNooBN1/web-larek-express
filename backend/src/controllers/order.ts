import { NextFunction, Request, Response } from 'express';
import {faker} from '@faker-js/faker'
import BadRequestError from '../errors/bad-request-error';
import product from '../models/product';
import ServerError from '../errors/server-error';

export const postOrder = (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    // console.log("Post order", body);

    const order = body;
    const items = order.items;
    product.find(
      {_id:{ $in: items}},
      {_id: 1, price: 1}
    )
    .then((findedItems)=>{
      if(findedItems.length != items.length){
        return next(new BadRequestError("Can`t find items in db"));
      }

      let nullPriceIndex = findedItems.findIndex(item=>item.price === null);
      if(nullPriceIndex !== -1)
        return next(new BadRequestError(`Item has no price ${findedItems[nullPriceIndex]._id}`));

      let totalPrice = findedItems.reduce((sum, current)=>sum + Number(current.price), 0)
      if(totalPrice != order.total){
        // console.log(totalPrice ,order.total);
        // console.log(findedItems);
        return next(new BadRequestError("totalPrice != price"));
      }

      res.status(200).send({"id": faker.string.uuid(), "total": order.total})
    })
    .catch(err=>{
      return next(new ServerError("DB error"));
    })


};