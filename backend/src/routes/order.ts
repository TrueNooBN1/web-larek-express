import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import postOrder from '../controllers/order';
import { orderSchema } from '../middlewares/validators';

const orderRouter = Router();

const orderRouteValidator = celebrate({
  [Segments.BODY]: orderSchema,
});

orderRouter.post('/', orderRouteValidator, postOrder);

export default orderRouter;
