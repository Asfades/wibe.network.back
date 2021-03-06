import {
  Controller,
  Param,
  Body,
  Get,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AudioService } from './audio.service';
import { GetUserAudioDto, GetUserAudioValidationPipe } from './dto/get-user-audio.dto';
import { getFolder, FileCategories } from 'src/utils/upload.utils';

@Controller('audio')
export class AudioController {
  constructor(
    private audioService: AudioService
  ) {}

  @Get('demo-playlist')
  getDemoPlaylist() {
    return this.audioService.getDemoPlaylist();
  }

  @Get('files/:filename')
  getAudioFile(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    return res.sendFile(filename, { root: getFolder(FileCategories.Audios) });
  }

  @Get('user-audio')
  getYourAudio(
    @Body(new GetUserAudioValidationPipe()) getUserAudioDto: GetUserAudioDto
  ) {
    return this.audioService.getUserAudio(getUserAudioDto);
  }

}
