export class UserDto {
  constructor(object: any) {
    this.name = object.name;
    this.surname = object.surname;
    this.email = object.email;
    this.phone = object.phone;
  };
  name: string;
  surname: string;
  email: string;
  phone: number;
}