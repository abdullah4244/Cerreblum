import mongoose from 'mongoose';

interface ICategory {
    title : string;
}
const categoryScema = new mongoose.Schema<ICategory>({
  title : {
    type : String,
    required : true
  }
})
export const Category = mongoose.model<ICategory>('Category', categoryScema);