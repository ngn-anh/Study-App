import { Prop, SchemaFactory, Schema} from "@nestjs/mongoose";

export type PermissionDocument = Permission & Document;

@Schema({collection: 'permissions',  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class Permission {
  @Prop({ required: true, unique: true })
  code: string; // user.create

  @Prop({ required: true })
  name: string; // Tạo người dùng

  @Prop({ required: true })
  module: string; // user

  @Prop({ required: true })
  action: string; // create | read | update | delete
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);