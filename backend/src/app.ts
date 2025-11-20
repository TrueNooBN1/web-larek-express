import express from "express"
import { MongoClient } from 'mongodb';
import cors from 'cors';

const {PORT, DB_ADDRESS} = process.env;

if (!DB_ADDRESS) {
    throw new Error('DB_ADDRESS environment variable is required');
}
if (!PORT) {
    throw new Error('PORT environment variable is required');
}
 
const app = express();
const client = new MongoClient(DB_ADDRESS);

app.use(cors());

app.listen(PORT, async ()=>{
  try{
    await client.connect();
    console.log(`App listening on port ${PORT}`);
    console.log("DB connected")
  }catch(err){
    console.log("DB not connected, error->", err)
  }
});