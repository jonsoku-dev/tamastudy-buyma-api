import mongoose from 'mongoose';
import { UserRole } from '../../common/schemas/user.schema';

export class UserResponseDto {
  _id: mongoose.ObjectId;
  username: string;
  email: string;
  isblock: boolean;
  role: UserRole;
}
