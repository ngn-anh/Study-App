import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RolePermission,
  RolePermissionDocument,
} from './schemas/role-permissions.schema';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectModel(RolePermission.name)
    private rolePermissionModel: Model<RolePermissionDocument>,
  ) {}

  /** Gán permissions cho role (chỉ thêm mới, không xoá) */
  async assign(dto: AssignPermissionsDto): Promise<any> {
    const docs = dto.permissions.map((permission) => ({
      role_code: dto.role_code,
      permission_code: permission,
    }));

    return this.rolePermissionModel.insertMany(docs, {
      ordered: false, // bỏ qua bản ghi trùng
    });
  }

  /** Lấy tất cả role-permission */
  async findAll(): Promise<any[]> {
    return this.rolePermissionModel.find().lean().exec();
  }

  /** Lấy permissions theo role */
  async findByRole(role_code: string): Promise<string[]> {
    const records = await this.rolePermissionModel
      .find({ role_code })
      .lean()
      .exec();

    return records.map((r) => r.permission_code);
  }

  /** Update permissions của role (xoá cũ → thêm mới) */
  async update(role_code: string, dto: UpdateRolePermissionsDto): Promise<any> {
    await this.rolePermissionModel.deleteMany({ role_code });

    const docs = dto.permissions.map((permission) => ({
      role_code,
      permission_code: permission,
    }));

    return this.rolePermissionModel.insertMany(docs);
  }

  /** Xoá 1 permission khỏi role */
  async removePermission(
    role_code: string,
    permission_code: string,
  ): Promise<any> {
    return this.rolePermissionModel.deleteOne({
      role_code,
      permission_code,
    });
  }

  /** Xoá toàn bộ permissions của role */
  async removeRole(role_code: string): Promise<any> {
    return this.rolePermissionModel.deleteMany({ role_code });
  }
}
