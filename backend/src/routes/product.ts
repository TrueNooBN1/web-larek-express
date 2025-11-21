import { Router } from "express";
import { deleteProduct, getProducts, patchProduct, postProduct } from "../controllers/products";
import { auth } from "../middlewares/auth";

const router = Router();

router.get('/', getProducts);
router.post('/', auth, postProduct);
router.patch('/:productId', auth, patchProduct);
router.delete('/:productId', auth, deleteProduct);

export {router as productsRouter};