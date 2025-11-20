import { Router } from "express";
import { postOrder } from "../controllers/order";
import { celebrate, Segments } from "celebrate";
import { orderSchema } from "../middlewares/validators";

const router = Router();

const orderRouteValidator = celebrate({
  [Segments.BODY] : orderSchema
});

router.post('/', orderRouteValidator, postOrder);

export {router as orderRouter};