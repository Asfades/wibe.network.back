import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFilename, filetypeFilter } from 'src/utils/upload.utils';
import { GetUser } from 'src/utils/get-user.decorator';
import { User } from 'src/auth/user.schema';

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
  @Post(':profile/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/profiles/image',
        filename: editFilename
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
}
