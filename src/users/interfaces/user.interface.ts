import { Document } from 'mongoose';

export interface User extends Document{
  name: string;
  surname: number;
  email: string;
  phone: number;
  password: string;
  auth: {
    email : {
      valid : boolean,
    }
  }
}