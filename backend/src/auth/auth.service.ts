import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';

@Injectable()
export class AuthService {
  private accessTokenExpiresIn = '60m';
  private refreshTokenExpiresIn = '1d';

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: [{ email: loginDto.identifier }, { mobile: loginDto.identifier }],
    });
    if (!user || !(await bcrypt.compare(loginDto.password, user['password']))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this._generateTokens(user);
    return ResponseHelper.success("User logged in successfully.", tokens);
  }

  async refreshToken(dto: RefreshTokenDto) {
    const payload = await this._verifyToken(dto.refreshToken, true);
    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const tokens = await this._generateTokens(user);
    return ResponseHelper.success("Refresh token generated successfully.", tokens);
  }

  async renewToken(user: User) {
    const tokens = await this._generateTokens(user);
    return ResponseHelper.success("Refresh token generated successfully.", tokens);
  }

  private async _generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, mobile: user.mobile };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: this.accessTokenExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: this.refreshTokenExpiresIn,
    });

    // await this.userRepo.update(user.id, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async _verifyToken(token: string, isRefresh = false) {
    try {
      return this.jwtService.verify(token, {
        secret: isRefresh
          ? process.env.JWT_REFRESH_SECRET
          : process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Token expired or invalid');
    }
  }
}
