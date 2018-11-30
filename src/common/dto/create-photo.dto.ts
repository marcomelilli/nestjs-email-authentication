export class CreatePhotoDto {
  constructor(object: any = {}) {
    this.description = object.description;
    this.tags = object.tags;
    this.imageData = object.imageData;
  };
  readonly description: string;
  readonly tags: string[];
  readonly imageData: string;
}