import { UserEntity } from "src/users/entities/user.entity";
import { UserDocument } from "src/users/schemas/user.schema";


export function toUserEntity(user: UserDocument): UserEntity {
  return {
    id: user._id.toString(),
    username: user.username,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    class_id:user.class_id.toString(),
    created_at: user.created_at,
    updated_at: user.updated_at,
    deleted_at: user.deleted_at,
  };
}
