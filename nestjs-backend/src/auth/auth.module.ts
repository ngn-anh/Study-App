import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RolePermission, RolePermissionSchema } from '../role-permissions/schemas/role-permissions.schema';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    MongooseModule.forFeature([
      { name: RolePermission.name, schema: RolePermissionSchema }
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
