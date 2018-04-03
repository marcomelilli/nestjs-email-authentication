import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  surname: String,
  email: String,
  phone: Number,
  password: String,
  auth: {
    email : {
      valid : { type: Boolean, default: false }
    }
  }
});