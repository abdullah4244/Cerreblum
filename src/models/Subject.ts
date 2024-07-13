import mongoose,{Schema, Types} from 'mongoose';

interface ISubject {
    title : string;
    category : Types.ObjectId,
    topics : [Types.ObjectId],
    imageUrl : string;
    
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
  },
  topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }],
  imageUrl : {
    type : String,
    required : true
  }
})
export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);