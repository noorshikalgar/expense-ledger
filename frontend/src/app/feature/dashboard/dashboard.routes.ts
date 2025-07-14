import { Routes } from "@angular/router";

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(
        (m) => m.Dashboard
      ),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./components/transactions/transactions').then(
        (m) => m.Transactions
      ),
  }
];