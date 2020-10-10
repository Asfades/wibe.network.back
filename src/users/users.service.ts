import {
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';

import { User } from '../auth/user.schema';
import { UploadUserImageDto } from './dto/upload-user-image.dto';
import { getFolder, FileCategories } from 'src/utils/upload.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async getProfile(username: string): Promise<{
    avatar: string;
    background: string;
  }> {
    const found = await this.userModel.findOne({ username }).exec();
    if (!found) return null;
    return {
      avatar: found.avatar,
      background: found.background
    };
  }

  async uploadAvatar(uploadAvatarDto: UploadUserImageDto): Promise<void> {
    const { id, filename } = uploadAvatarDto;

    let user;

    try {
      user = await this.userModel.findOne({ id });
    } catch (error) {
      throw new Error(error);
    }

    if (user) {
      if (user.avatar) {
        let filepath = getFolder(FileCategories.Avatars);
        fs.promises.unlink(`${filepath}/${user.avatar}`);
      }

      user.avatar = filename;
    }

    try {
      await user.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadBackground(uploadBackgroundDto: UploadUserImageDto): Promise<void> {
    const { id, filename } = uploadBackgroundDto;

    let user;

    try {
      user = await this.userModel.findOne({ id });
    } catch (error) {
      throw new Error(error);
    }

    if (user) {
      if (user.background) {
        let filepath = getFolder(FileCategories.Backgrounds);
        fs.promises.unlink(`${filepath}/${user.background}`);
      }

      user.background = filename;
    }

    try {
      await user.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}