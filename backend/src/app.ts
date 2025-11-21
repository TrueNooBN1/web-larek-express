import express from "express"
import cors from 'cors';
import { productsRouter } from "./routes/product";
import {PORT, DB_ADDRESS} from "./config"
import mongoose from "mongoose";
import { orderRouter } from "./routes/order";
import { errors } from "celebrate";
import { errorHandler } from "./middlewares/error-handler";
import { errorLogger, requestLogger } from "./middlewares/logger";
import { authRouter } from "./routes/auth";

const cookieParser = require('cookie-parser')

const path = require('path');

if (!DB_ADDRESS) {
    throw new Error('DB_ADDRESS environment variable is required');
}
 
mongoose.connect(DB_ADDRESS);
const app = express();

//настройка логгирования и мидлваров для парса данных
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())
app.use(cors());
app.use(requestLogger)

//настройка роутов и статик директории с файлами
app.use(express.static(path.join(__dirname, 'public')));
app.use('/product', productsRouter);
app.use('/order', orderRouter);
app.use('/auth', authRouter);

//настройка мидлваров для обработки и логгирования ошибок
app.use(errorLogger)
app.use(errorHandler);
app.use(errors())

//run server
app.listen(+PORT, async ()=>{
  console.log(`App listening on port ${PORT}`);
  console.log(`DB connected on address ${DB_ADDRESS}`)
});