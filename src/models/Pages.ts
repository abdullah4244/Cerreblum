import mongoose from "mongoose";

// Define the Page schema
interface IPage {
    description : string;
    imageUrl : string;
    question: string;
    options : [string];
    answer : string;
    title :string;
}
const pageSchema = new mongoose.Schema<IPage>({
  title : {
    type: String,
   },
    description: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
      },
      question: {
        type: String,
      },
      options: {
        type: [String],
        validate: {
          validator: (val: string[]) => { 
            if(val.length === 0){
              return true;
            }
            return val.length === 4
          },
          message: 'Options array must have 4 options',
        },
      },
      answer: {
        type: String,
        validate: {
          validator: function (this: IPage, value: string) {
            return this.options.includes(value);
          },
          message: (props: any) => `${props.value} is not a valid answer option`,
        },
      },
});
pageSchema.pre('save' ,async function savePassword(next){
  const page = this;
  const pages = await Page.find();
  page.title = `Page ${pages.length + 1}`
next();
})
export const Page = mongoose.model<IPage>('Page', pageSchema);