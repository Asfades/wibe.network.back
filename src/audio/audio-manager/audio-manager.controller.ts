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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { editFileName, audioFileFilter } from '../utils/audio-upload.utils';
import { AuthGuard } from '@nestjs/passport';
import { AudioService } from '../audio.service';
import { GetUser } from '../utils/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { SaveAudioDto } from '../dto/save-audio.dto';

@UseGuards(AuthGuard())
@Controller('audio')
export class AudioManagerController {
  constructor(
    private audioService: AudioService
  ) {}

  @Post('preload')
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: diskStorage({
        destination: './audio-tracks',
        filename: editFileName
      }),
      fileFilter: audioFileFilter
    })
  )
  preload(
    @UploadedFile() file,
    @GetUser() user: User
  ) {
    return this.audioService.preloadAudio({
      userId: user.id,
      filename: file.filename
    });
  }

  @Patch('confirm/:trackId')
  confirm(
    @Param('trackId') trackId: string,
    @Body() saveAudioDto: SaveAudioDto,
  ) {
    // console.log('saveAudioDto in controller: ', saveAudioDto);
    return this.audioService.confirmUpload(trackId, saveAudioDto);
  }

  @Delete('delete/:trackId')
  delete(
    @Param('trackId') trackId: string
  ) {
    return this.audioService.deleteAudio(trackId);
  }
}
