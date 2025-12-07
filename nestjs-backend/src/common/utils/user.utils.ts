export const a='2';
import { UserEntity } from "src/users/entities/user.entity";
import { UserDocument } from "src/users/schemas/user.schema";


export function toUserEntity(user: UserDocument): UserEntity {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    full_name: user.full_name,
    class_id: user.class_id,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
    deleted_at: user.deleted_at,
  };
}
