import mongoose from "mongoose";

// enum Categories{
//   "главное",
//   "неглавное"
// }

interface IImage{
  fileName: string;
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
  fileName:{
    type: String,
    required: [true, 'Поле fileName должно быть заполнено'],
  },
  originalName:{
    type: String,
    required: [true, 'Поле originalName должно быть заполнено'],
  }
});

const productSchema = new mongoose.Schema<IProduct>({
 title: {
    type: String,
    unique: true,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
  }, 
  image: imageSchema,
  category:{
    type: String,
    required: false,
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

productSchema.index({ title: 1 }, { unique: true });


export default mongoose.model<IProduct>('product', productSchema); 