import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class AudioDoc extends Document {
  @Prop({ default: uuid})
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: 'empty' })
  name: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ default: [] })
  genres: string[];
}

export const AudioSchema = SchemaFactory.createForClass(AudioDoc);