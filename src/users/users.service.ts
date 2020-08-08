import {
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../auth/user.schema';
import { UploadUserImageDto } from './dto/upload-user-image.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async getProfile(username: string): Promise<any> {
    const found = await this.userModel.findOne({ username }).exec();
    return {
      avatar: found.image
    };
  }

  async uploadImage(uploadAudioDto: UploadUserImageDto): Promise<void> {
    const { id, filename } = uploadAudioDto;

    let user;

    try {
      user = await this.userModel.findOne({ id });
    } catch (error) {
      throw new Error(error);
    }

    if (user) {
      user.image = filename;
    }

    try {
      await user.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}