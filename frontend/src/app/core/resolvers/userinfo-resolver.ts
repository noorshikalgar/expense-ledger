import { ResolveFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { ApiWrapper } from '../services/api.wrapper';
import { inject } from '@angular/core';
import { UserInfo } from '../types/user.interface';
import { of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const userinfoResolver: ResolveFn<UserInfo | null> = (route, state) => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const userInfo = userService.getUserInfo();
  const apiWrapper = inject(ApiWrapper);
  if (!userInfo || Object.keys(userInfo).length === 0) {
    return apiWrapper.get<UserInfo>('/users').pipe(
      tap((response: any) => {
        console.log('Auth check successful:', response);
        userService.setUserInfo(response.data);
      }),
      map((response: any) => response.data as UserInfo),
      catchError((error) => {
        console.error('Auth check failed:', error);
        if (error.status === 401) {
          // Handle unauthorized access, e.g., redirect to login
          userService.setUserInfo({}); // Clear user info
          authService.removeAuthTokens(); // Clear auth tokens
          console.warn('User not authenticated, redirecting to login');
          return of(null); // Return null to indicate no user info available
        }
        return of(null);
      })
    );
  } else {
    return of(userInfo);
  }
};