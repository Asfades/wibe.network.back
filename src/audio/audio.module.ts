import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AudioSchema } from './audio.schema';
import { AudioManagerModule } from './audio-manager/audio-manager.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: 'Audio',
        schema: AudioSchema
      }
    ]),
    AudioManagerModule
  ],
  providers: [AudioService],
  controllers: [AudioController]
})
export class AudioModule {}
