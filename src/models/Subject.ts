import mongoose,{Schema, Types} from 'mongoose';

interface ISubject {
    title : string;
    category : Types.ObjectId
    
}
const SubjectSchema = new mongoose.Schema<ISubject>({
  title : {
    type : String,
    required : true
  },
  category : {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
})
export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);