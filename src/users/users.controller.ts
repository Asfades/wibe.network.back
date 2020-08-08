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
        filename: editFilename(FileCategories.Avatars)
      }),
      fileFilter: filetypeFilter(/\.(jpg|jpeg|png)$/)
    })
  )
  uploadProfileImage(
    @GetUser() user: User,
    @UploadedFile() file
  ) {
    return this.usersService.uploadImage({
      id: user.id,
      filename: file.filename
    });
  }

  @Get('avatars/:filename')
  getProfileImage(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    return res.sendFile(filename, { root: getFolder(FileCategories.Avatars) });
  }
}
