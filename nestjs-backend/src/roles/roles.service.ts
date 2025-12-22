import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { removeAccentsRegex } from 'src/helper';
import { Permission } from 'src/permissions/schemas/permissions.schema';
import { RolePermission } from 'src/role-permissions/schemas/role-permissions.schema';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    @InjectModel(RolePermission.name) private rolePermissionModel: Model<RolePermission>,
  ) {}

  async create(dto: CreateRoleDto) {
    const exists = await this.roleModel.findOne({ code: dto.code });

    if (exists) {
      throw new BadRequestException('Mã vai trò đã tồn tại');
    }

    return this.roleModel.create({
      ...dto
    });
  }

  async getDetail(code: string) {
    const role = await this.roleModel.findOne({ code }).lean();

    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }

    return role;
  }

  async update(code: string, dto: UpdateRoleDto) {
    const role = await this.roleModel.findOne({ code });

    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }

    role.name = dto.name ?? role.name;
    role.description = dto.description ?? role.description;

    await role.save();

    return role;
  }

  async delete(code: string) {
    const role = await this.roleModel.findOne({ code });

    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }

    //  Check role có user sử dụng không
    const userCount = await this.userModel.countDocuments({
      role: code,
    });

    if (userCount > 0) {
      throw new BadRequestException(
        'Không thể xoá vai trò đang được sử dụng',
      );
    }

    //  Xoá role-permissions trước
    await this.rolePermissionModel.deleteMany({
      role_code: code,
    });

    // Xoá role
    await this.roleModel.deleteOne({ code });

    return {
      message: 'Xoá vai trò thành công',
    };
  }


  async findAll(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const match: any = {};

    // 🔍 search theo tên vai trò
    if (query.name) {
      const regex = removeAccentsRegex(query.name);
      match.name = { $regex: regex, $options: 'i' };
    }

    // 🔍 status
    if (query.status) {
      match.status = Number(query.status);
    }

    const [data, totalArr] = await Promise.all([
      this.roleModel.aggregate([
        { $match: match },

        // JOIN role_permissions
        {
          $lookup: {
            from: 'role-permissions', 
            localField: 'code',
            foreignField: 'role_code',
            as: 'permissions',
          },
        },

        // JOIN users
        {
          $lookup: {
            from: 'users',
            localField: 'code',
            foreignField: 'role',
            as: 'users',
          },
        },

        // Đếm số quyền
        {
          $addFields: {
            permissions_count: { $size: '$permissions' },
            users_count: { $size: '$users' },
          },
        },

        // Không trả mảng permissions
        {
          $project: {
            permissions: 0,
            users: 0,
          },
        },

        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),

      // Đếm tổng
      this.roleModel.aggregate([
        { $match: match },
        { $count: 'total' },
      ]),
    ]);

    const total = totalArr[0]?.total || 0;

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async getRolePermissions(roleCode: string) {
    // 1. Lấy tất cả permission của hệ thống
    const allPermissions = await this.permissionModel.find().lean();

    // 2. Lấy permission_code của role hiện tại
    const rolePermissions = await this.rolePermissionModel
      .find({ role_code: roleCode })
      .select('permission_code')
      .lean();

    const rolePermissionSet = new Set(
      rolePermissions.map(rp => rp.permission_code),
    );

    // 3. Gom nhóm + gắn assigned
    const grouped: Record<string, any[]> = {};

    allPermissions.forEach(p => {
      if (!grouped[p.module]) grouped[p.module] = [];

      grouped[p.module].push({
        code: p.code,
        name: p.name,
        action: p.action,
        assigned: rolePermissionSet.has(p.code),
      });
    });

    // 4. Format cho FE
    return Object.keys(grouped).map(module => ({
      module,
      permissions: grouped[module],
    }));
  }

  async updateRolePermissions(
    roleCode: string,
    permissionCodes: string[],
  ) {
    // 1. Lấy quyền hiện tại của role
    const currentRolePerms = await this.rolePermissionModel
      .find({ role_code: roleCode })
      .lean();

    const currentCodes = currentRolePerms.map(rp => rp.permission_code);

    const newSet = new Set(permissionCodes);
    const currentSet = new Set(currentCodes);

    // 2. Quyền cần thêm
    const toInsert = permissionCodes.filter(
      code => !currentSet.has(code),
    );

    // 3. Quyền cần xoá
    const toDelete = currentCodes.filter(
      code => !newSet.has(code),
    );

    // 4. Insert quyền mới
    if (toInsert.length) {
      await this.rolePermissionModel.insertMany(
        toInsert.map(code => ({
          role_code: roleCode,
          permission_code: code,
        })),
      );
    }

    // 5. Xoá quyền bị bỏ
    if (toDelete.length) {
      await this.rolePermissionModel.deleteMany({
        role_code: roleCode,
        permission_code: { $in: toDelete },
      });
    }

    return {
      added: toInsert,
      removed: toDelete,
    };
  }

  async getRoleOptions() {
    const roles = await this.roleModel
      .find({ deleted_at: null }) // chỉ role active
      .select('code name')
      .sort({ name: 1 })
      .lean();

    return roles.map(role => ({
      label: role.name,
      value: role.code,
    }));
  }

}
