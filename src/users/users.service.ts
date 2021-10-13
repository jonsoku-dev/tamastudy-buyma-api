import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/common/schemas/user.schema';
import { JoinUserRequestDto } from './dto/join-user.request.dto';
import bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user.response.dto';
import {
  GetAllUsersQueryDto,
  GetAllUsersQueryStatus,
} from './dto/get-all-users.query.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll({ limit = 10, offset = 0, status }: GetAllUsersQueryDto) {
    const query = {};
    if (status === GetAllUsersQueryStatus.BLOCK) {
      query['isblock'] = true;
    } else if (status === GetAllUsersQueryStatus.NON_BLOCK) {
      query['isblock'] = false;
    }
    return this.userModel.find(query).skip(offset).limit(limit).exec();
  }

  async findOne(email: string): Promise<UserResponseDto> {
    const foundUser = await this.userModel
      .findOne({
        email,
      })
      .select('password')
      .exec();

    if (!foundUser) {
      throw new NotFoundException(
        `${email} 에 해당하는 유저가 존재하지 않습니다.`,
      );
    }

    return foundUser;
  }

  async create(dto: JoinUserRequestDto): Promise<void> {
    const foundUser = await this.userModel
      .findOne({ email: dto.email })
      .select('password')
      .exec();
    if (foundUser) {
      throw new ConflictException('이미 존재하는 유저입니다.');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({
      ...dto,
      password: hashedPassword,
      isblock: true,
    });
    await user.save();
    return null;
  }

  async remove(email: string): Promise<UserResponseDto> {
    const foundUser = await this.userModel.findOneAndDelete({ email });
    if (!foundUser) {
      throw new NotFoundException(
        `${email} 에 해당하는 유저가 존재하지 않습니다.`,
      );
    }
    return foundUser;
  }

  async block(email: string): Promise<UserResponseDto> {
    const foundUser = await this.userModel.findOne({ email }).exec();
    if (!foundUser) {
      throw new NotFoundException(
        `${email} 에 해당하는 유저가 존재하지 않습니다.`,
      );
    }
    if (!foundUser.isblock) {
      throw new BadRequestException(
        `${email} 에 해당하는 유저는 이미 block 된 상태입니다.`,
      );
    }
    return foundUser;
  }
}
