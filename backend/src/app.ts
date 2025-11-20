import express from "express"
import { MongoClient } from 'mongodb';
import cors from 'cors';
import { productsRouter } from "./routes/product";
import {PORT, DB_ADDRESS} from "./config"
import mongoose from "mongoose";
import { orderRouter } from "./routes/order";
import { error } from "console";
import { errors } from "celebrate";

const path = require('path');

if (!DB_ADDRESS) {
    throw new Error('DB_ADDRESS environment variable is required');
}
if (!PORT) {
    throw new Error('PORT environment variable is required');
}
 
mongoose.connect(DB_ADDRESS);
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/product', productsRouter);
app.use('/order', orderRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use(errors())

app.listen(+PORT, async ()=>{
  try{
    console.log(`App listening on port ${PORT}`);
    console.log(`DB connected on address ${DB_ADDRESS}`)
  }catch(err){
    console.log("DB not connected, error->", err)
  }
});