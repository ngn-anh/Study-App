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
import { ListUserDto } from './dto/list-user.dto';
import { removeAccentsRegex } from 'src/helper';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import {
  RolePermission,
  RolePermissionDocument,
} from 'src/role-permissions/schemas/role-permissions.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(RolePermission.name)
    private rolePermissionModel: Model<RolePermissionDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const userData: Partial<any> = {
        ...dto,
        password: hashedPassword,
        role: dto.class_id ? 'student' : 'staff', // Nếu có class_id thì role = 1 (normal user), nếu không có class_id thì role = 2 (admin)
        class_id: dto.class_id ? new Types.ObjectId(dto.class_id) : null,
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

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument | null> {
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
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.class_id !== undefined)
      user.class_id = new Types.ObjectId(dto.class_id);

    await user.save();

    return toUserEntity(user);
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async list(query: ListUserDto) {
    const {
      roles,
      exclude_roles,
      status,
      class: classId,
      name,
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};

    if (roles && roles.length > 0) {
      filter.role = { $in: roles };
    }

    if (exclude_roles?.length) {
      filter.role = { $nin: exclude_roles };
    }

    if (classId) {
      filter.class_id = new Types.ObjectId(classId);
    }

    if (status !== undefined) {
      if (Number(status) === 1) {
        filter.deleted_at = null;
      } else {
        filter.deleted_at = { $ne: null };
      }
    }

    if (name) {
      const regex = removeAccentsRegex(name);
      filter.$or = [
        { username: { $regex: regex, $options: 'i' } },
        { full_name: { $regex: regex, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const rolesData = await this.roleModel
      .find({}, { code: 1, name: 1 })
      .lean();

    const roleMap = new Map(rolesData.map((r) => [r.code, r.name]));

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .populate({
          path: 'class_id',
          select: 'name', // chỉ lấy tên lớp
        })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data: users.map((u: any) => ({
        id: u._id.toString(),
        username: u.username,
        full_name: u.full_name,
        email: u.email,
        phone: u.phone,
        avatar: u.avatar,
        role: u.role,
        role_name: roleMap.get(u.role) ?? u.role,
        status: u.deleted_at ? 2 : 1,
        class_name: u.class_id?.name ?? null,
      })),
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        total_pages: Math.ceil(total / Number(limit)),
      },
    };
  }
  async softDelete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user id');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Nếu đã bị xoá rồi
    if (user.deleted_at) {
      throw new BadRequestException('User already deleted');
    }

    user.deleted_at = new Date();
    await user.save();

    return {
      message: 'Soft delete user successfully',
    };
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).lean();
    if (!user) return [];

    const rolePermissions = await this.rolePermissionModel
      .find({
        role_code: user.role,
      })
      .lean();

    return rolePermissions.map((rp) => rp.permission_code);
  }
}
