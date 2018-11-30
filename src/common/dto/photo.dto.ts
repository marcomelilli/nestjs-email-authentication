export class PhotoDto {
  constructor(object: any = {}) {
    this.url = object.url;
    this.description = object.description;
    this.tags = object.tags;
    this.date = object.date;
  };
  url: string;
  description: string;
  tags: string[];
  date: Date;
}