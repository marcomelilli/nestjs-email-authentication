import { CreatePhotoDto } from "common/dto/create-photo.dto";

export class UpdateGalleryDto {
  readonly email: string;
  newPhoto: CreatePhotoDto; //photo to add (action: add)
  readonly photoId: string; //photo id to remove (action: remove)
  readonly action: string;
}