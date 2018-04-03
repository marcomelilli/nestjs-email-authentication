import * as mongoose from 'mongoose';

export const ForgottenPasswordSchema = new mongoose.Schema({
  email: String,
  newPasswordToken: String,
  timestamp: Date
});