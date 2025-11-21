import { Router } from 'express';
import {
  deleteProduct, getProducts, patchProduct, postProduct,
} from '../controllers/products';
import { auth } from '../middlewares/auth';

const productsRouter = Router();

productsRouter.get('/', getProducts);
productsRouter.post('/', postProduct);
productsRouter.patch('/:productId', auth, patchProduct);
productsRouter.delete('/:productId', auth, deleteProduct);

export default productsRouter;
