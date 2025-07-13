import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserInfo } from '../types/user.interface';

export const userinfoResolver: ResolveFn<UserInfo | null> = (route, state) => {
  const userService = inject(UserService);
  const userInfo = userService.getLocalUserInfo();
  if (!userInfo || Object.keys(userInfo).length === 0) {
    return userService.fetchUserInfo();
  } else {
    return of(userInfo as UserInfo);
  }
};
