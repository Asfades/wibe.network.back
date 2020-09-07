import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res
} from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFilename, filetypeFilter, FileCategories, getFolder } from 'src/utils/upload.utils';
import { GetUser } from 'src/utils/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Get(':profile')
  getProfile(
    @Param('profile') username: string
  ) {
    return this.usersService.getProfile(username);
  }

  @UseGuards(AuthGuard())
  @Post(':profile/avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: getFolder(FileCategories.Avatars),
        filename: editFilename(FileCategories.Avatars, '.png')
      })
    })
  )
  uploadAvatar(
    @GetUser() user: User,
    @UploadedFile() file
  ) {
    return this.usersService.uploadAvatar({
      id: user.id,
      filename: file.filename
    });
  }

  @Get('avatars/:filename')
  getAvatar(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    return res.sendFile(filename, { root: getFolder(FileCategories.Avatars) });
  }

  @UseGuards(AuthGuard())
  @Post(':profile/background')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: getFolder(FileCategories.Backgrounds),
        filename: editFilename(FileCategories.Backgrounds, '.png')
      })
    })
  )
  uploadBackground(
    @GetUser() user: User,
    @UploadedFile() file
  ) {
    return this.usersService.uploadBackground({
      id: user.id,
      filename: file.filename
    });
  }

  @Get('backgrounds/:filename')
  getBackground(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    return res.sendFile(filename, { root: getFolder(FileCategories.Backgrounds) });
  }
}
