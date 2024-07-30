import mongoose,{Types} from 'mongoose';

interface ITopic {
    title : string;
    subject : Types.ObjectId
    pages : [Types.ObjectId],
    imageUrl : string,
    isPremium : Boolean;
}
const topicSchema = new mongoose.Schema<ITopic>({
  title : {
    type : String,
    required : true
  },
  subject : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  pages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page'
  }],
  imageUrl : {
    type :String,
    required : true
  },
  isPremium : {
    type : Boolean,
    default : false
  }
})
export const Topic = mongoose.model<ITopic>('Topic', topicSchema);