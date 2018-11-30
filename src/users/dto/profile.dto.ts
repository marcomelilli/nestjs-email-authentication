export class ProfileDto {
  constructor(object: any) {
    this.email = object.email;
    this.name = object.name;
    this.surname = object.surname;    
    this.birthdaydate = object.birthdaydate;
    this.phone = object.phone;
    this.profilepicture = object.profilepicture;
  };
  readonly email: string;
  readonly name: string;
  readonly surname: string;
  readonly birthdaydate: Date;
  readonly phone: string;
  readonly profilepicture: string;
}