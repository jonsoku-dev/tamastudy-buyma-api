import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

@Schema({
  timestamps: true,
})
export class User {
  _id: mongoose.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
    index: true,
  })
  isblock: boolean;

  @Prop({
    enum: [UserRole.User, UserRole.Admin],
    required: true,
    default: UserRole.User,
  })
  role: UserRole;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
