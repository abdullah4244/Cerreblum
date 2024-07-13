import mongoose,{Types} from 'mongoose';

interface ITopic {
    title : string;
    subject : Types.ObjectId
    pages : [Types.ObjectId]
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
  }]
})
export const Topic = mongoose.model<ITopic>('Topic', topicSchema);