import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer'; 
import {default as config} from '../config';
import { Component, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UserSchema } from './schemas/user.schema';

const saltRounds = 10;

@Component()
export class UsersService {

  constructor(
    @InjectModel(UserSchema) private readonly userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({email: email}).exec();
  }

  async createNewUser(newUser: CreateUserDto): Promise<User> {   
    var isUserRegistered = await this.findByEmail(newUser.email);
    if(!isUserRegistered){
      newUser.password = await bcrypt.hash(newUser.password, saltRounds);
      var createdUser = new this.userModel(newUser);
      return await createdUser.save();
    } else {
      throw new HttpException('REGISTER.USER_ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }

  async setPassword(email: string, newPassword: string): Promise<boolean> { 
    var userFromDb = await this.userModel.findOne({ email: email});
    if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    
    userFromDb.password = await bcrypt.hash(newPassword, saltRounds);

    await userFromDb.save();
    return true;
  }

}