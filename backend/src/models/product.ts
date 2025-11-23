import mongoose from 'mongoose';
import fs from 'fs/promises';

// enum Categories{
//   "главное",
//   "неглавное"
// }

const path = require('path');

export interface IImage{
  fileName: string;
  originalName: string;
}

export interface IProduct{
  title: string;
  image: IImage;
  category?: string;
  description?: string;
  price?: number | null;
}

const imageSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: [true, 'Поле fileName должно быть заполнено'],
  },
  originalName: {
    type: String,
    required: [true, 'Поле originalName должно быть заполнено'],
  },
});

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    unique: true,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
  },
  image: {
    type: imageSchema,
    required: [true, 'Поле "image" должно быть заполнено'],
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
});

const deleteProductFiles = (product: IProduct) => {
  if (!product.image.fileName) {
    return;
  }

  const fullPath = path.join(__dirname, '../public', product.image.fileName);
  // console.log(fullPath);
  fs.unlink(fullPath)
    .then(() => {
    })
    .catch(() => {
    });
};

productSchema.post('findOneAndDelete', async (product: IProduct) => {
  if (product) {
    await deleteProductFiles(product);
  }
});

productSchema.index({ title: 1 }, { unique: true });

export default mongoose.model<IProduct>('product', productSchema);
