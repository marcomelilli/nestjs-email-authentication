import { Document } from 'mongoose';
import { Photo } from 'common/interfaces/photo.interface';

export interface User extends Document{
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdaydate: Date;
  password: string;
  roles: string[];
  auth: {
    email : {
      valid : boolean,
    },
    facebook: {
      userid: string
    },
    gmail: {
      userid: string
    }
  },
  settings: {
  },
  photos: {
    profilePic: Photo;
    gallery: Photo[];
  }
}