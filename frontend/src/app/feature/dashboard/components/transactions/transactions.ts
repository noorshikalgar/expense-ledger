import { Component, signal, WritableSignal } from '@angular/core';
import { DashboardHttpService } from '../../services/dashboard-http.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Transaction } from '../../types/dashbaord.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, TableModule, TagModule, ButtonModule, RouterLink],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions {
  transactions: WritableSignal<Transaction[]> = signal<Transaction[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);

  constructor(private dashboardHttpService: DashboardHttpService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.isLoading.set(true);
    this.dashboardHttpService.getAllTransactions().subscribe({
      next: (response: any) => {
        console.log('Transactions fetched successfully:', response);
        this.transactions.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.isLoading.set(false);
      },
    });
  }

  getSeverity(type: string): string {
    switch (type) {
      case 'expense':
        return 'danger';
      case 'income':
        return 'success';
      case 'transfer':
        return 'info';
      default:
        return 'primary';
    }
  }

  viewTransactionDetails(transaction: Transaction): void {
    console.log('Viewing details for transaction:', transaction.id);
  }
}
