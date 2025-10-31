export class UserEntity {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
