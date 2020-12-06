import * as mongoose from 'mongoose';
import { PhotoSchema } from 'common/schemas/photo.schema';

export const UserSchema = new mongoose.Schema({
  id: String,
  date: {type: Date, default: Date.now},
  name: String,
  surname: String,
  email: String,
  phone: String,
  password: String,
  birthdaydate: Date,
  roles: [],
  auth: {
    email : {
      valid : { type: Boolean, default: false }
    },
    facebook: {
      userid: String
    },
    gmail: {
      userid: String
    }
  },
  settings: {
  },
  photos: {
    profilePic: {}, //{ type:  mongoose.Schema.Types.ObjectId , ref: 'PhotoSchema'}
    gallery: [] //[{type:  mongoose.Schema.Types.ObjectId , ref: 'PhotoSchema'}]
  }
});