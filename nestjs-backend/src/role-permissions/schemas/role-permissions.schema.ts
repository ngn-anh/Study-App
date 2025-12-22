import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type RolePermissionDocument = RolePermission & Document;

@Schema({collection: 'role-permissions',  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class RolePermission {
  @Prop({ type: String, required: true })
  role_code: string; // admin, staff

  @Prop({ type: String, required: true })
  permission_code: string; // user.create
}

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermission);