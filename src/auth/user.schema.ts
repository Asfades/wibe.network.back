import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class User extends Document {
  @Prop({ default: uuid})
  id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  salt: string;

  @Prop({ default: uuid })
  refreshToken: string;

  @Prop({ default: [] })
  trackIds: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);