import { inject, Injectable } from '@angular/core';
import { UserInfo } from '../types/user.interface';
import { AuthService } from './auth.service';
import { ApiWrapper } from './api.wrapper';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authService = inject(AuthService);
  apiWrapper = inject(ApiWrapper);

  private userInfo: UserInfo = {} as UserInfo;

  constructor() { }

  setUserInfo(userInfo: any) {
    console.log('Setting user info:', userInfo);
    this.userInfo = userInfo;
  }

  getLocalUserInfo(): any {
    console.log('Getting user info:', this.userInfo);
    return this.userInfo;
  }

  isUserLoggedIn(): boolean {
    const loggedInStatus = this.authService.getAccessToken() !== null;
    return loggedInStatus;
  }

  fetchUserInfo(): Observable<UserInfo | null> {
    return this.apiWrapper.get<UserInfo>('/users').pipe(
      tap((response: any) => {
        console.log('Auth check successful:', response);
        this.setUserInfo(response.data);
      }),
      map((response: any) => response.data as UserInfo),
      catchError((error: any) => {
        console.error('Auth check failed:', error);
        if (error.status === 401) {
          // Handle unauthorized access, e.g., redirect to login
          this.setUserInfo({}); // Clear user info
          this.authService.removeAuthTokens(); // Clear auth tokens
          console.warn('User not authenticated, redirecting to login');
          return of(null); // Return null to indicate no user info available
        }
        return of(null);
      })
    );
  }

  createNewUser(userData: any) {
    return this.apiWrapper.post('/users', userData).pipe(
      tap((response: any) => {
        console.log('User created successfully:', response);
        this.setUserInfo(response.data);
      }),
      map((response: any) => response.data as UserInfo),
      catchError((error: any) => {
        console.error('User creation failed:', error);
        return of(null); // Return null on error
      })
    );
  }
}
