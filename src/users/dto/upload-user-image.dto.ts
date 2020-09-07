import { IsString } from "class-validator";

export class UploadUserImageDto {
  @IsString()
  id: string;

  @IsString()
  filename: string;
}