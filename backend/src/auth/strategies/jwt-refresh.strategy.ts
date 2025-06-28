import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env.JWT_REFRESH_SECRET ?? "this-is-my-strong-secret-key",
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    return { id: payload.sub, email: payload.email, mobile: payload.mobile };
  }
}
