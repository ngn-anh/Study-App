import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';
import { RolePermission } from 'src/role-permissions/schemas/role-permissions.schema';
import { Permission } from 'src/permissions/schemas/permissions.schema';
import { ROLES_SEED } from 'src/roles/seeds/roles.seed';
import { PERMISSIONS_SEED } from 'src/permissions/seeds/permissions.seed';
import { ROLE_PERMISSIONS_SEED } from 'src/role-permissions/seeds/role-permissions.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const roleModel = app.get<Model<Role>>(getModelToken(Role.name));
  const permissionModel = app.get<Model<Permission>>(
    getModelToken(Permission.name),
  );
  const rolePermissionModel = app.get<Model<RolePermission>>(
    getModelToken(RolePermission.name),
  );

  console.log('🌱 Seeding database...');

  // CLEAR OLD DATA
  await roleModel.deleteMany({});
  await permissionModel.deleteMany({});
  await rolePermissionModel.deleteMany({});

  // INSERT NEW
  await roleModel.insertMany(ROLES_SEED);
  await permissionModel.insertMany(PERMISSIONS_SEED);
  await rolePermissionModel.insertMany(ROLE_PERMISSIONS_SEED);

  console.log('✅ Seed data completed');

  await app.close();
  process.exit(0);
}

bootstrap();
