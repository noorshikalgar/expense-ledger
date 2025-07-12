import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiWrapper {

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { 
    console.log('ApiWrapper initialized with API URL:', this.apiUrl);
  }

  get<T>(url: string) {
    return this.httpClient.get<T>(`${this.apiUrl}${url}`);
  }

  post<T>(url: string, body: any) {
    return this.httpClient.post<T>(`${this.apiUrl}${url}`, body);
  }

  put<T>(url: string, body: any) {
    return this.httpClient.put<T>(`${this.apiUrl}${url}`, body);
  }

  delete<T>(url: string) {
    return this.httpClient.delete<T>(`${this.apiUrl}${url}`);
  }
}
