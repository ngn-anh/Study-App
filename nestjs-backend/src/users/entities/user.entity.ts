export class UserEntity {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  full_name?: string;
  class_id?: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
