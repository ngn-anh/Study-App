export const a='1';
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ----------------------------- REGISTER -----------------------------
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  // ----------------------------- LOGIN -----------------------------
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  // ----------------------------- REFRESH TOKEN -----------------------------
  @Post('refresh-token')
  async refresh(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(body.refreshToken);
  }
}
