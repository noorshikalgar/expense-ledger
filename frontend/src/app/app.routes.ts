import { Routes } from '@angular/router';
import { userinfoResolver } from './core/resolvers/userinfo-resolver';
import { authGuard } from './core/guards/auth-guard';
import { App } from './app';

export const routes: Routes = [
  {
    path: '',
    component: App,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./feature/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./feature/auth/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    resolve: {
      auth: userinfoResolver,
    },
    loadComponent: () =>
      import('./feature/dashboard/pages/dashboard-page/dashboard-page').then(
        (m) => m.DashboardPage
      ),
    loadChildren: () =>
      import('./feature/dashboard/dashboard.routes').then(
        (m) => m.dashboardRoutes
      ),
  },
];
