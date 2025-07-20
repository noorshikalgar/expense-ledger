import { Component, Input, SimpleChanges } from '@angular/core';
import { Transaction } from '../../types/dashbaord.model';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-summary',
  imports: [CommonModule],
  templateUrl: './transaction-summary.html',
  styleUrl: './transaction-summary.scss'
})
export class TransactionSummary {
  @Input() transactions: Transaction[] = [];

  month: string = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // start of month generate timestamps


  startOfMonth: number = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  endOfMonth: number = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime();

  totalIncome: number = 0;
  totalExpense: number = 0;
  balance: number = 0;

  constructor() {}

  ngOninit(): void {
    this.calculateSummary();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['transactions'] && changes['transactions'].currentValue) {
      this.calculateSummary();
    }
  }

  calculateSummary(): void {
    const currentMonthTransactions = this.transactions
      .filter(transaction => new Date(transaction.transaction_date).getTime() >= this.startOfMonth && new Date(transaction.transaction_date).getTime() <= this.endOfMonth)
      
      this.totalIncome = currentMonthTransactions.filter(transaction => transaction.type === 'income')
      .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

    this.totalExpense = currentMonthTransactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

    this.balance = this.totalIncome - this.totalExpense;

    console.log(`Total Income: ${this.totalIncome}, Total Expense: ${this.totalExpense}, Balance: ${this.balance}`);
  }
}
