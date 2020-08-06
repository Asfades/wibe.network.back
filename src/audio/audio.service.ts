import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import * as fs from 'fs';

import { User } from 'src/auth/user.schema';
import { AudioDoc } from './audio.schema';
import { UploadAudioDto } from './dto/upload-audio.dto';
import { SaveAudioDto } from './dto/save-audio.dto';
import { GetUserAudioDto } from './dto/get-user-audio.dto';

@Injectable()
export class AudioService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Audio') private readonly audioModel: Model<AudioDoc>
  ) {}

  async preloadAudio(uploadAudioDto: UploadAudioDto): Promise<{ trackId: string, filename: string }> {
    const { userId, filename } = uploadAudioDto;

    const audio = new this.audioModel({
      userId,
      filename,
    });

    try {
      await audio.save();
    } catch (error) {
      throw new Error(error);
    }

    return {
      trackId: audio.id,
      filename
    }
  }

  async confirmUpload(trackId: string, saveAudioDto: SaveAudioDto): Promise<void> {
    const { name, genres } = saveAudioDto;
    let audio: AudioDoc;

    try {
      audio = await this.audioModel.findOne({ id: trackId }).exec();
    } catch (error) {
      throw new Error(error);
    }

    audio.name = name;

    if (genres) {
      audio.genres = genres;
    }

    try {
      await audio.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAudio(trackId: string): Promise<void> {
    const found = await this.audioModel.findOne({ id: trackId }).exec();

    if (found) {
      try {
        await this.audioModel.deleteOne({ id: trackId }).exec();
        await fs.promises.unlink(`./audio-tracks/${found.filename}`);
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  async getDemoPlaylist(): Promise<{ name: string, filename: string }[]> {
    const result = await this.audioModel.find().limit(10).exec();
    return result.map(audioData => ({
      name: audioData.name,
      filename: audioData.filename
    }));
  }

  async getUserAudio(getUserAudioDto: GetUserAudioDto): Promise<{}> {
    const { userId, tracksNumber, tracksPage } = getUserAudioDto;
    const foundAudios = await this.audioModel
      .find({ userId })
      .skip(tracksNumber * tracksPage)
      .limit(tracksNumber || 10);
    return foundAudios.map(({ filename, name }) => ({
      filename,
      name
    }));
  }
}
