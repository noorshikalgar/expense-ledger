import { Injectable } from '@angular/core';
import { ApiWrapper } from '../../../core/services/api.wrapper';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardHttpService {

  constructor(private apiWrapper: ApiWrapper) { }

  getAllTransactions<T = any>() {
    return this.apiWrapper.get<T>('/transactions').pipe(
      tap(response => {
        console.log('Fetched all transactions:', response);
      })
    );
  }
}
