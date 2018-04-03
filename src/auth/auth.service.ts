import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt'; 
import * as nodemailer from 'nodemailer';
import {default as config} from '../config';
import { Component, HttpException, HttpStatus } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/interfaces/user.interface';
import { UserDto } from '../users/dto/user.dto';
import { UserSchema } from '../users/schemas/user.schema';
import { EmailVerification } from './interfaces/emailverification.interface';
import { EmailVerificationSchema } from './schemas/emailverification.schema';
import { ForgottenPassword } from './interfaces/forgottenpassword.interface';
import { ForgottenPasswordSchema } from './schemas/forgottenpassword.schema';


const saltRounds = 10;

@Component()
export class AuthService {
  constructor(@InjectModel(UserSchema) private readonly userModel: Model<User>, 
  @InjectModel(EmailVerificationSchema) private readonly emailVerificationModel: Model<EmailVerification>,
  @InjectModel(ForgottenPasswordSchema) private readonly forgottenPasswordModel: Model<ForgottenPassword>,
  private readonly jwtService: JWTService) {}


  async validateLogin(email, password) {
    var userFromDb = await this.userModel.findOne({ email: email});
    if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    if(!userFromDb.auth.email.valid) throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);

    var isValidPass = await bcrypt.compare(password, userFromDb.password);

    if(isValidPass){
      var accessToken = await this.jwtService.createToken(email);
      return { token: accessToken, user: new UserDto(userFromDb)}
    } else {
      throw new HttpException('LOGIN.PASSWORD_INCORRECT', HttpStatus.UNAUTHORIZED);
    }

  }

  async createEmailToken(email: string): Promise<boolean> {
    var emailVerificationModel = await this.emailVerificationModel.findOneAndUpdate( 
      {email: email},
      { 
        email: email,
        emailToken: Math.floor(Math.random() * (900000000)) + 100000000, //Generate 9 digits number
        timestamp: new Date()
      },
      {upsert: true}
    );
    if(emailVerificationModel){
      return true;
    } else {
      throw new HttpException('LOGIN.ERROR.GENERIC_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createForgottenPasswordToken(email: string): Promise<ForgottenPassword> {
    var forgottenPasswordModel = await this.forgottenPasswordModel.findOneAndUpdate(
      {email: email},
      { 
        email: email,
        newPasswordToken: Math.floor(Math.random() * (900000000)) + 100000000, //Generate 9 digits number,
        timestamp: new Date()
      },
      {upsert: true}
    );
    if(forgottenPasswordModel){
      return forgottenPasswordModel;
    } else {
      throw new HttpException('LOGIN.ERROR.GENERIC_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    var emailVerif = await this.emailVerificationModel.findOne({ emailToken: token});
    if(emailVerif && emailVerif.email){
      var userFromDb = await this.userModel.findOne({ email: emailVerif.email});
      if (userFromDb) {
        userFromDb.auth.email.valid = true;
        var savedUser = await userFromDb.save();
        await emailVerif.remove();
        return !!savedUser;
      }
    } else {
      throw new HttpException('LOGIN.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
    }
  }

  async getForgottenPasswordModel(newPasswordToken: string, newPassword: string): Promise<ForgottenPassword> {
    return await this.forgottenPasswordModel.findOne({newPasswordToken: newPasswordToken});
  }

  async sendEmailVerification(email: string): Promise<boolean> {   
    var model = await this.emailVerificationModel.findOne({ email: email});

    if(model && model.emailToken){
        let transporter = nodemailer.createTransport({
            host: config.mail.host,
            port: config.mail.port,
            secure: config.mail.secure,
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        });
    
        let mailOptions = {
          from: '"NestJs Auth"', 
          to: email, 
          subject: 'Verify Email', 
          text: 'Verify Email', 
          html: 'Hi! <br><br> Thanks for your registration<br><br>'+
          '<a href='+ config.host.url + ':' + config.host.port +'/auth/email/verify/'+ model.emailToken + '>Click here to activate your account</a>'  // html body
        };
    
        var sended = await new Promise<boolean>(async function(resolve, reject) {
          return await transporter.sendMail(mailOptions, async (error, info) => {
              if (error) {      
                console.log('Message sent: %s', error);
                return reject(false);
              }
              console.log('Message sent: %s', info.messageId);
              resolve(true);
          });      
        })

        return sended;
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }

  async sendEmailForgotPassword(email: string): Promise<boolean> {
    var userFromDb = await this.userModel.findOne({ email: email});
    if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    var tokenModel = await this.createForgottenPasswordToken(email);

    if(tokenModel && tokenModel.newPasswordToken){
        let transporter = nodemailer.createTransport({
            host: config.mail.host,
            port: config.mail.port,
            secure: config.mail.secure, 
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        });
    
        let mailOptions = {
          from: '"NestJs Auth"', 
          to: email, 
          subject: 'Forgot Password', 
          text: 'Forgot Password',
          html: 'Hi! <br><br> If you requested to reset your password<br><br>'+
          '<a href='+ config.host.url + ':' + config.host.port +'/auth/email/reset-password/'+ tokenModel.newPasswordToken + '>Click here</a>'  // html body
        };
    
        var sended = await new Promise<boolean>(async function(resolve, reject) {
          return await transporter.sendMail(mailOptions, async (error, info) => {
              if (error) {      
                console.log('Message sent: %s', error);
                return reject(false);
              }
              console.log('Message sent: %s', info.messageId);
              resolve(true);
          });      
        })

        return sended;
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }



}
