import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { User } from '../common/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return user;
    }
    return null;
  }
}
