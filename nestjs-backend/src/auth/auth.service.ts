import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../users/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { toUserEntity } from 'src/common/utils/user.utils';


@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: RegisterDto): Promise<UserEntity> {
    const existingUser = await this.usersService.findByUsername(dto.username);
    if (existingUser) throw new BadRequestException('Username already exists');

    return this.usersService.create(dto);
  }

  async login(dto: LoginDto): Promise<{ token: string; refreshToken: string; user: UserEntity }> {
    const userDoc = await this.usersService.validateUser(dto.username, dto.password);
    if (!userDoc) throw new BadRequestException('Invalid credentials');

    const payload = { id: userDoc._id.toString(), username: userDoc.username, role: userDoc.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET || 'your_refresh_secret', { expiresIn: '7d' });

    userDoc.refresh_token = refreshToken;
    userDoc.token_expired = Math.floor(Date.now() / 1000) + 3600;
    await userDoc.save();

    return {
      token,
      refreshToken,
      user: toUserEntity(userDoc),
    };
  }
}
