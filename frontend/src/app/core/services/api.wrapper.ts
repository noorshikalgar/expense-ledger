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

  get<T>(url: string, queryParams?: any) {
    return this.httpClient.get<T>(`${this.apiUrl}${url}?${this.queryString(queryParams ? queryParams : {})}`);
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

  private queryString(params: any): string {
    return Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }
}
