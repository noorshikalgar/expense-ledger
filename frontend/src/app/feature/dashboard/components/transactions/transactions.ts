import { Component, signal, WritableSignal } from '@angular/core';
import { DashboardHttpService } from '../../services/dashboard-http.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Transaction } from '../../types/dashbaord.model';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TransactionSummary } from "../transaction-summary/transaction-summary";

@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    RouterLink,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    DatePickerModule,
    TransactionSummary
],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions {
  transactions: WritableSignal<Transaction[]> = signal<Transaction[]>([]);
  filteredTransactions: WritableSignal<Transaction[]> = signal<Transaction[]>(
    []
  );
  isLoading: WritableSignal<boolean> = signal(true);

  page: number = 1;
  pageSize: number = 10;

  searchQuery: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private dashboardHttpService: DashboardHttpService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  onSearch(type: 'search' | 'startDate' | 'endDate' = 'search'): void {
    const localTransactions = this.transactions();
    if (type === 'search' && this.searchQuery) {
      const filteredTransactions = localTransactions.filter(
        (transaction) =>
          transaction.amount
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          transaction.description
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      );
      this.filteredTransactions.set(filteredTransactions);
    } else if (type === 'startDate' && this.startDate) {
      const startTimestamp = this.startDate.getTime();
      const filteredTransactions = localTransactions.filter(
        (transaction) =>
          new Date(transaction.transaction_date).getTime() >= startTimestamp
      );
      this.filteredTransactions.set(filteredTransactions);
    } else if (type === 'endDate' && this.endDate) {
      const endTimestamp = this.endDate.getTime();
      const filteredTransactions = localTransactions.filter(
        (transaction) =>
          new Date(transaction.transaction_date).getTime() <= endTimestamp
      );
      this.filteredTransactions.set(filteredTransactions);
    } else if (this.startDate && this.endDate) {
      const startTimestamp = this.startDate.getTime();
      const endTimestamp = this.endDate.getTime();
      const filteredTransactions = localTransactions.filter(
        (transaction) =>
          new Date(transaction.transaction_date).getTime() >= startTimestamp &&
          new Date(transaction.transaction_date).getTime() <= endTimestamp
      );
      this.filteredTransactions.set(filteredTransactions);
    } else {
      this.filteredTransactions.set(localTransactions); // Reset to original transactions if search query is empty
    }
  }

  fetchTransactions() {
    this.isLoading.set(true);
    this.dashboardHttpService
      .getAllTransactions({
        page: this.page,
        itemsPerPage: this.pageSize,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Transactions fetched successfully:', response);
          this.transactions.set(response.data);
          this.filteredTransactions.set(response.data);
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
