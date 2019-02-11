import * as mongoose from 'mongoose';

export const ConsentRegistrySchema = new mongoose.Schema({
  email: String,
  registrationForm: [Array],
  checkboxText: String,
  date: Date,
  privacyPolicy: String,
  cookiePolicy: String,
  acceptedPolicy: String
});