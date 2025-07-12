import { inject, Injectable } from '@angular/core';
import { UserInfo } from '../types/user.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authService = inject(AuthService);

  private userInfo: UserInfo = {} as UserInfo;

  constructor() { }

  setUserInfo(userInfo: any) {
    console.log('Setting user info:', userInfo);
    this.userInfo = userInfo;
  }

  getUserInfo(): any {
    console.log('Getting user info:', this.userInfo);
    return this.userInfo;
  }

  isUserLoggedIn(): boolean {
    const loggedInStatus = this.authService.getAccessToken() !== null;
    return loggedInStatus;
  }
}
