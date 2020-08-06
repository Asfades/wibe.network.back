import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  UseGuards,
  Body,
  Patch,
  Delete,
  Get,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

import { editFileName, audioFileFilter } from './utils/audio-upload.utils';
import { AuthGuard } from '@nestjs/passport';
import { AudioService } from './audio.service';
import { GetUser } from './utils/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { SaveAudioDto } from './dto/save-audio.dto';
import { GetUserAudioDto, GetUserAudioValidationPipe } from './dto/get-user-audio.dto';

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
    return res.sendFile(filename, { root: './audio-tracks'});
  }

  @Get('user-audio')
  getYourAudio(
    @Body(new GetUserAudioValidationPipe()) getUserAudioDto: GetUserAudioDto
  ) {
    return this.audioService.getUserAudio(getUserAudioDto);
  }

  // @Get('files/:filename')
  // seeUploadedFile(
  //   @Param('filename') image: string,
  //   @Res() res: Response
  // ) {
  //   return res.sendFile(image, { root: './files' });
  // }

}
