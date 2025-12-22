import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role, RoleSchema } from './schemas/role.schema';
import { Permission, PermissionSchema } from 'src/permissions/schemas/permissions.schema';
import { RolePermission, RolePermissionSchema } from 'src/role-permissions/schemas/role-permissions.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema },
        { name: Permission.name, schema: PermissionSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
       { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
