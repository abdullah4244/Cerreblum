import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
export interface IUSER {
    name : string;
    email :string;
    password? : string;
    institution : string;
    yearOfStudy : number;
    roles : [string];
    loginTimestamps : [Date]
    isSubscribed : Boolean,
    stripeId : String,
    gems: number;
    hearts : number;
}

const UserSchema = new mongoose.Schema<IUSER>({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  institution : {
    type : String,
    required : false
  },
  loginTimestamps: {
    type: [Date],
    default: []
  },
  roles: {
    type: [String],
    enum: ['admin', 'student'],
    default: ['student'],
},
isSubscribed : {
  type : Boolean,
  default : false
},
stripeId :{
 type : String,
 unique : true
},
  yearOfStudy : {
    type : Number,
    required : false
  },
  gems :{
    type : Number,
    default: 0
  },
  hearts : {
    type : Number,
    default : 0
  }

})

UserSchema.pre('save' ,async function savePassword(next){
    const user = this;
    if(user.password){
    const hashedPassword = await bcrypt.hash(user.password, 8);
     user.password = hashedPassword;
    }
  next();
})
export const User = mongoose.model<IUSER>('User', UserSchema);