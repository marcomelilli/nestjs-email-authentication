import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileDto } from 'users/dto/profile.dto';
import { SettingsDto } from 'users/dto/settings.dto';
import { PhotoDto } from '../common/dto/photo.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import * as _ from 'lodash'

const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>) {}

  
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({email: email}).exec();
  }

  async createNewUser(newUser: CreateUserDto): Promise<User> { 
    if(this.isValidEmail(newUser.email) && newUser.password){
      var userRegistered = await this.findByEmail(newUser.email);
      if(!userRegistered){
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
        var createdUser = new this.userModel(newUser);
        createdUser.roles = ["User"];
        return await createdUser.save();
      } else if (!userRegistered.auth.email.valid) {
        return userRegistered;
      } else {
        throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException('REGISTRATION.MISSING_MANDATORY_PARAMETERS', HttpStatus.FORBIDDEN);
    } 
    
  }

  isValidEmail (email : string){
    if(email){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false
  }

  async setPassword(email: string, newPassword: string): Promise<boolean> { 
    var userFromDb = await this.userModel.findOne({ email: email});
    if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    
    userFromDb.password = await bcrypt.hash(newPassword, saltRounds);

    await userFromDb.save();
    return true;
  }

  async updateProfile(profileDto: ProfileDto): Promise<User> {
    let userFromDb = await this.userModel.findOne({ email: profileDto.email});
    if(!userFromDb) throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    if(profileDto.name) userFromDb.name = profileDto.name;
    if(profileDto.surname) userFromDb.surname = profileDto.surname;
    if(profileDto.phone) userFromDb.phone = profileDto.phone;
    if(profileDto.birthdaydate) userFromDb.birthdaydate = profileDto.birthdaydate;

    if(profileDto.profilepicture){
      let base64Data = profileDto.profilepicture.replace(/^data:image\/png;base64,/, "");
      let dir = "../public/users/"+ userFromDb.email;
      
      let success = await this.writeFile( dir, "profilepic.png", base64Data);
      if(success == true) {
        userFromDb.photos = userFromDb.photos || { profilePic : new PhotoDto(), gallery: []};
        userFromDb.photos.profilePic = userFromDb.photos.profilePic || new PhotoDto();
        userFromDb.photos.profilePic.date = new Date();
        userFromDb.photos.profilePic.url = "/public/users/" + userFromDb.email + "/profilepic.png"
      }
    }
    
    await userFromDb.save();
    return userFromDb;
  }

  async updateGallery(galleryRequest: UpdateGalleryDto): Promise<User> {
    let userFromDb = await this.userModel.findOne({ email: galleryRequest.email});
    if(!userFromDb) throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    let dir = "../public/users/" + userFromDb.email;
    if(galleryRequest.newPhoto) try {galleryRequest.newPhoto = JSON.parse(<any>galleryRequest.newPhoto)} catch(e){}; //TODO: capire come mai dalla request arriva come stringa e bisogna parsarlo
    
    if(galleryRequest.action){
      switch (galleryRequest.action) {
        case 'add':
          let base64Data = galleryRequest.newPhoto.imageData.replace(/^data:image\/png;base64,/, "");
          var newFileName = this.guid() + ".png";
          var success = await this.writeFile( dir, newFileName, base64Data);
          if(success == true) {
            let newPhoto = new PhotoDto(galleryRequest.newPhoto);
            newPhoto.date = new Date();
            newPhoto.url = "/public/users/" + userFromDb.email + "/" + newFileName;
            userFromDb.photos = userFromDb.photos || { profilePic : new PhotoDto(), gallery: []};
            userFromDb.photos.gallery.push(newPhoto) 
          }
          break;
        case 'remove':
          var success = await this.removeFile( dir, galleryRequest.photoId);
          if(success) _.remove(userFromDb.photos.gallery, (photo) => { return photo.url.includes(galleryRequest.photoId)});
          userFromDb.markModified('photos');
          break;
        default:
          throw new HttpException('GALLERY.MISSING_ACTION', HttpStatus.NOT_FOUND);
      }
    }
    
    return userFromDb.save();
  }

  async writeFile(dir: string, filename: string, base64Data: string): Promise<any> {
    return new Promise(function(resolve, reject) {
      let fs = require('fs');
      if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }
      fs.writeFile(dir + '/' + filename, base64Data, 'base64', function(err) {
          if (err) reject(err);
          else resolve(true);
      });
    });
  }

  async removeFile(dir: string, filename: string): Promise<any> {
    return new Promise(function(resolve, reject) {
      let fs = require('fs');
      if (fs.existsSync(dir)){ 
        fs.stat(dir + '/' + filename, function(err, stat) {
          if(err == null) {
            //file exists
            fs.unlink(dir + '/' + filename, (err) => {
              if (err) reject(err);
              else resolve(true);
            });
          } else if(err.code == 'ENOENT') {
            // file does not exist
            resolve(true);
          } else {
            reject(err);
          }
        });
        
      }
    });
  }

  guid(){
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  async updateSettings(settingsDto: SettingsDto): Promise<User> {
    var userFromDb = await this.userModel.findOne({ email: settingsDto.email});
    if(!userFromDb) throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    
    userFromDb.settings = userFromDb.settings || {};
    for (var key in settingsDto) {
      if (settingsDto.hasOwnProperty(key) && key != "email") {
        userFromDb.settings[key] = settingsDto[key];
      }
    }
    
    await userFromDb.save();
    return userFromDb;
  }

}