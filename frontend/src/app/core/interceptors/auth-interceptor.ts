import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authToken = authService.getAccessToken();

  if (authToken) {
    // Clone the request to add the authentication header.
    req = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${authToken}`),
    });
  }

  // Handle the response
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Token expired, invalid, or unauthorized access
        console.warn(
          '401/403 Unauthorized/Forbidden. Redirecting to login.',
          error
        );
        // Handle logout and navigation here if needed
        authService.removeAuthTokens();
        router.navigate(['/login']);
        return throwError(() => error);
      }
      // For any other error, re-throw it
      return throwError(() => error);
    })
  );
};
