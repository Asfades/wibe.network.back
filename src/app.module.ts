import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { AuthModule } from './auth/auth.module';
import { AudioModule } from './audio/audio.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://dbUser:BbXc4RUi58Vey3q@cluster0-ifuyr.mongodb.net/first-test?retryWrites=true&w=majority'),
    MulterModule.register(),
    AuthModule,
    AudioModule,
    UsersModule
  ]
})
export class AppModule {}
