import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt'; // dùng bcryptjs cho dễ cài
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { toUserEntity } from 'src/common/utils/user.utils';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
     try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const createdUser = new this.userModel({
         ...dto, 
         password: hashedPassword,
          class_id: new Types.ObjectId(dto.class_id) , 
        });
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
}
