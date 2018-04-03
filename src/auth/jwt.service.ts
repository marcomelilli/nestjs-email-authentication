import * as jwt from 'jsonwebtoken';
import {default as config} from '../config';
import { Component} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/interfaces/user.interface';
import { UserSchema } from '../users/schemas/user.schema';

const saltRounds = 10;

@Component()
export class JWTService {
  constructor(@InjectModel(UserSchema) private readonly userModel: Model<User>) {}


  async createToken(email) {
    const expiresIn = config.jwt.expiresIn,
      secretOrKey = config.jwt.secretOrKey;
    const userInfo = { email: email};
    const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  async validateUser(signedUser): Promise<boolean> {
    var userFromDb = await this.userModel.findOne({ email: signedUser.email});
    if (userFromDb) {
        return true;
    }
    return false;
  }


}
