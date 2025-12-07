export const a='1';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt'; // dùng bcryptjs cho dễ cài
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { toUserEntity } from 'src/common/utils/user.utils';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
     try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
        const userData: Partial<any> = {
        ...dto,
        password: hashedPassword,
        role: dto.class_id ? 1 : 2, // Nếu có class_id thì role = 1 (normal user), nếu không có class_id thì role = 2 (admin)
        class_id: dto.class_id ?  new Types.ObjectId(dto.class_id) : null
      };

    const createdUser = new this.userModel(userData);
      await createdUser.save();
      return toUserEntity(createdUser);
    } catch (error: any) {
      // Check duplicate key error
      if (error.code === 11000) {
        // error.keyValue chứa field trùng
        const field = Object.keys(error.keyValue)[0];
        throw new BadRequestException(`${field} already exists`);
      }
      throw error;
    }
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async validateUser(username: string, password: string): Promise<UserDocument | null> {
    const user = await this.findByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async updateAvatar(dto: UpdateAvatarDto): Promise<UserEntity> {
    const user = await this.userModel.findById(dto.user_id);
    if (!user) throw new BadRequestException('User not found');

    user.avatar = dto.avatar;
    await user.save();

    return toUserEntity(user);
  }

  async updateProfile(dto: UpdateProfileDto): Promise<UserEntity> {
    const user = await this.userModel.findById(dto.user_id);
    if (!user) throw new BadRequestException('User not found');

    // Cập nhật các trường nếu tồn tại trong DTO
    if (dto.full_name !== undefined) user.full_name = dto.full_name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.class_id !== undefined) user.class_id = new Types.ObjectId(dto.class_id);

    await user.save();

    return toUserEntity(user);
  }

   async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}
