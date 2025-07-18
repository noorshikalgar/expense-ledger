import { Injectable } from '@angular/core';
import { ApiWrapper } from '../../../core/services/api.wrapper';
import { tap } from 'rxjs';
import { TransactionFetchFilters } from '../types/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardHttpService {
  constructor(private apiWrapper: ApiWrapper) {}

  getAllTransactions<T = any>(
    filters: TransactionFetchFilters = {} as TransactionFetchFilters
  ) {
    return this.apiWrapper.get<T>('/transactions', filters).pipe(
      tap((response) => {
        console.log('Fetched all transactions:', response);
      })
    );
  }
}
