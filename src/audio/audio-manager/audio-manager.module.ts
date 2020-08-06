import { Module } from '@nestjs/common';
import { AudioManagerController } from './audio-manager.controller';
import { AudioService } from '../audio.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AudioSchema } from '../audio.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: 'Audio',
        schema: AudioSchema
      }
    ])
  ],
  controllers: [AudioManagerController],
  providers: [AudioService],
})
export class AudioManagerModule {}
