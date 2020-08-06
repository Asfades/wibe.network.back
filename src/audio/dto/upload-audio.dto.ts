import { IsString } from "class-validator";

export class UploadAudioDto {
  @IsString()
  userId: string;

  @IsString()
  filename: string;
}