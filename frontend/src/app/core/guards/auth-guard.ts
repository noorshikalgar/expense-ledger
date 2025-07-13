import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authToken = inject(AuthService).getAccessToken();

  if (!authToken) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
