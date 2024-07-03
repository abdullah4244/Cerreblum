import mongoose from "mongoose";

// Define the Page schema
interface IPage {
    description : string;
    imageUrl : string;
    question: string;
    options : [string];
    answer : string;
}
const pageSchema = new mongoose.Schema<IPage>({
    description: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
      },
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: true,
        validate: {
          validator: (val: string[]) => val.length === 4,
          message: 'Options array must have 4 options',
        },
      },
      answer: {
        type: String,
        required: true,
        validate: {
          validator: function (this: IPage, value: string) {
            return this.options.includes(value);
          },
          message: (props: any) => `${props.value} is not a valid answer option`,
        },
      },
});
export const Page = mongoose.model<IPage>('Page', pageSchema);