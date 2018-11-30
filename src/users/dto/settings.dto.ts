export class SettingsDto {
  constructor(object: any) {
    object = object || {};
    this.email = object.email;
  };
  readonly email: string;
}