import { Document } from 'mongoose';

export interface ForgottenPassword extends Document{
    email: string;
    newPasswordToken: string;
    timestamp: Date;
  }