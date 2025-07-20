import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Transaction } from '../../types/dashbaord.model';
import { Account, Card } from '../../types/accounts.model';
import { DashboardHttpService } from '../../services/dashboard-http.service';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-accounts',
  imports: [
    TableModule,
    CommonModule,
    RouterLink,
    TagModule,
    ButtonModule,
    DrawerModule,
    CardModule,
  ],
  providers: [CurrencyPipe],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
})
export class Accounts {
  dashboardHttpService = inject(DashboardHttpService);
  currencyPipe = inject(CurrencyPipe);

  accounts: WritableSignal<Account[]> = signal<Account[]>([]);
  // filteredAccounts: WritableSignal<Account[]> = signal<Account[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);
  showDrawer: WritableSignal<boolean> = signal(false);
  drawerType: WritableSignal<string> = signal('');
  selectedAccount: WritableSignal<Account | null> = signal(null);

  page: number = 1;
  pageSize: number = 10;

  constructor() {}

  ngOnInit(): void {
    this.fetchAccounts();
  }

  viewAccountTransactions(account: Account): void {
    console.log('Account selected : ', account);
  }

  fetchAccounts(): void {
    this.isLoading.set(true);
    this.dashboardHttpService
      .getAllAccounts({ page: this.page, itemsPerPage: this.pageSize })
      .subscribe({
        next: (response: any) => {
          console.log('Accounts fetched successfully:', response.data);
          this.accounts.set(response.data);
        },
        error: (error: any) => {
          console.error('Error fetching accounts:', error);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  openDrawer(type: string, account: Account): void {
    this.showDrawer.set(true);
    console.log('Drawer opened for type:', type);
    this.drawerType.set(type);
    this.selectedAccount.set(account);
  }

  getCreditUtilized(card: Card): {
    creditUtilized: string;
    creditUtilizedPercentage: number;
    severity: string;
  } {
    if (card.type === 'credit') {
      const balance = card.balance;
      const limit = card.credit_limit;
      const utilized = Number(limit) - Number(balance);
      const percentage = ((utilized / Number(limit)) * 100).toFixed(2); //Number(utilized) / Number(limit)) * 100).toFixed(2)
      const severity =
        Number(percentage) > 60
          ? Number(percentage) > 80
            ? 'error'
            : 'warn'
          : 'success';
      return {
        creditUtilized:
          this.currencyPipe.transform(utilized, 'INR', 'symbol', '1.2-2') ||
          '0',
        creditUtilizedPercentage: Number(percentage),
        severity,
      };
    }
    return {
      creditUtilized: '0',
      creditUtilizedPercentage: Number(0),
      severity: '',
    }; // Return 0 if not a credit card
  }

    // Helper to determine text color for utilization
  getUtilizationColor(percentage: number): string {
    if (percentage > 80) {
      return 'text-red-400 font-semibold';
    } else if (percentage > 50) {
      return 'text-orange-400';
    }
    return 'text-green-400';
  }
}
