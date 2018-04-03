import * as mongoose from 'mongoose';

export const EmailVerificationSchema = new mongoose.Schema({
  email: String,
  emailToken: String,
  timestamp: Date
});