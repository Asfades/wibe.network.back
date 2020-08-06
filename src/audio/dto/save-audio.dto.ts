import { IsString, IsArray, MinLength, MaxLength, IsOptional } from "class-validator";

export class SaveAudioDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsArray()
  @IsOptional()
  genres: string[];
}