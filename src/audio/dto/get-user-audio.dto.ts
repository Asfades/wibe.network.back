import { IsString, IsNumber } from "class-validator";
import { PipeTransform } from "@nestjs/common";

export class GetUserAudioDto {
  @IsString()
  userId: string;

  @IsNumber()
  tracksNumber: number;

  @IsNumber()
  tracksPage: number;
}

export class GetUserAudioValidationPipe implements PipeTransform {
  transform(getUserAudioDto) {
    const { userId, tracksNumber, tracksPage } = getUserAudioDto;

    const parsedDto = {
      userId,
      tracksNumber: +tracksNumber,
      tracksPage: +tracksPage
    }

    return parsedDto;
  }
}