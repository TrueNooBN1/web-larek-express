import { Router } from "express";
import { getProducts, postProduct } from "../controllers/products";

const router = Router();

router.get('/', getProducts);
router.post('/', postProduct);

export {router as productsRouter};