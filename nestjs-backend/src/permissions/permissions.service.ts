import { Injectable } from "@nestjs/common";
import { Permission, PermissionDocument } from "./schemas/permissions.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { PermissionResponseDto } from "./dto/permission-response.dto";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}

  async create(dto: CreatePermissionDto) {
    return this.permissionModel.create(dto);
  }

  async findAll(): Promise<PermissionResponseDto[]> {
    return this.permissionModel
        .find()
        .lean<PermissionResponseDto[]>()
        .exec();
    }
}
