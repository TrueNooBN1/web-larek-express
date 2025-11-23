import mongoose, { Types } from 'mongoose';

export interface IToken{
  token: string;
}

export interface IUser{
  name?: string;
  email: string;
  password: string;
  tokens: IToken[];
}

export type IDBUser = IUser & {
  _id: Types.ObjectId;
}

const tokenSchema = new mongoose.Schema<IToken>({
  token: {
    type: String,
    required: [true, 'Поле token должно быть заполнено'],
  },
});

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля name - 2'],
    maxlength: [30, 'Максимальная длина поля name - 30'],
    default: 'Ё-моё',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: [6, 'Минимальная длина поля password - 6'],
    required: true,
    select: false,
  },
  tokens: [tokenSchema],
});

userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IUser>('user', userSchema);
