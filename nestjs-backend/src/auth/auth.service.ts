import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../users/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { toUserEntity } from 'src/common/utils/user.utils';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // ------------------------------------------------
  // TẠO TOKEN
  // ------------------------------------------------
  private createTokens(payload: any) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_SECRET || 'your_refresh_secret',
      { expiresIn: '7d' }
    );

    // Token hết hạn sau 1 giờ
    const tokenExpired = Math.floor(Date.now() / 1000) + 3600;

    return { accessToken, refreshToken, tokenExpired };
  }

  // ------------------------------------------------
  // REGISTER
  // ------------------------------------------------
  async register(dto: RegisterDto): Promise<{ token: string; refreshToken: string; user: UserEntity }> {
    const existingUser = await this.usersService.findByUsername(dto.username);
    if (existingUser) throw new BadRequestException('Username already exists');

    // Tạo user mới
    const createdUser = await this.usersService.create(dto);
    const userDoc = await this.usersService.findByUsername(createdUser.username);

    if (!userDoc) throw new BadRequestException("User not found after creation");

    const payload = { id: userDoc._id.toString(), username: userDoc.username, role: userDoc.role };
    const { accessToken, refreshToken, tokenExpired } = this.createTokens(payload);

    userDoc.refresh_token = refreshToken;
    userDoc.token_expired = tokenExpired;
    await userDoc.save();

    return {
      token: accessToken,
      refreshToken,
      user: toUserEntity(userDoc),
    };
  }

  // ------------------------------------------------
  // LOGIN
  // ------------------------------------------------
  async login(dto: LoginDto): Promise<{ token: string; refreshToken: string; user: UserEntity }> {
    const userDoc = await this.usersService.validateUser(dto.username, dto.password);
    if (!userDoc) throw new BadRequestException('Invalid credentials');

    const payload = { id: userDoc._id.toString(), username: userDoc.username, role: userDoc.role };
    const { accessToken, refreshToken, tokenExpired } = this.createTokens(payload);

    userDoc.refresh_token = refreshToken;
    userDoc.token_expired = tokenExpired;
    await userDoc.save();

    return {
      token: accessToken,
      refreshToken,
      user: toUserEntity(userDoc),
    };
  }

  // ------------------------------------------------
  // REFRESH TOKEN
  // ------------------------------------------------
  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'your_refresh_secret');
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Tìm user theo refresh_token
    const userDoc = await this.usersService.findById(decoded.id);
    if (!userDoc || userDoc.refresh_token !== refreshToken) {
      throw new UnauthorizedException('Refresh token not match');
    }

    // Tạo tokens mới
    const payload = { id: userDoc._id.toString(), username: userDoc.username, role: userDoc.role };
    const { accessToken, refreshToken: newRefresh, tokenExpired } = this.createTokens(payload);

    // Lưu refresh token mới
    userDoc.refresh_token = newRefresh;
    userDoc.token_expired = tokenExpired;
    await userDoc.save();

    return {
      token: accessToken,
      refreshToken: newRefresh,
      user: toUserEntity(userDoc),
    };
  }
}
