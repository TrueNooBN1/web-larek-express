import mongoose from "mongoose";

enum Categories{
  "главное",
  "неглавное"
}

interface IImage{
  filename: string;
  originalName: string;
}

interface IProduct{
  title: string;
  image: IImage;
  category?: string;
  description?: string;
  price?: string | null;
}

const imageSchema = new mongoose.Schema<IImage>({
  filename:{
    type: String,
    required: true,
  },
  originalName:{
    type: String,
    required: true,
  }
});

const productSchema = new mongoose.Schema<IProduct>({
  title:{
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  image: imageSchema,
  category:{
    type: String,
    required: false,
    enum: Object.values(Categories)
  },
  description:{
    type: String,
    required: false,
  },
  price:{
    type: Number,
    required: false,
  }
});


export default mongoose.model<IProduct>('product', productSchema); 