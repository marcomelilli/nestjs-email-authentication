import { SettingsDto } from "./settings.dto";
import { PhotoDto } from "../../common/dto/photo.dto";

export class UserDto {
  constructor(object: any) {
    this.name = object.name;
    this.surname = object.surname;
    this.email = object.email;
    this.phone = object.phone;
    this.birthdaydate = object.birthdaydate;
    this.settings = new SettingsDto(object.settings);
    this.photos = { 
      profilePic : new PhotoDto(object.photos.profilePic),
      gallery: []
    }
    if(object.photos && object.photos.gallery) {
      object.photos.gallery.forEach(photo => {
        this.photos.gallery.push(new PhotoDto(photo));
      });
    }
  };
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly phone: string;
  readonly birthdaydate: Date;
  settings: SettingsDto
  photos: {
    profilePic: PhotoDto;
    gallery: PhotoDto[];
  };
}