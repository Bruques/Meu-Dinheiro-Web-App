import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  // A URL do nosso Spring Boot
  private apiUrl = 'http://localhost:8080/api/expenses';

  // Injetamos o HttpClient no construtor
  constructor(private http: HttpClient) { }

  // Método que envia o texto para o backend
  extractExpense(text: string): Observable<any> {
    const payload = { text: text };
    return this.http.post<any>(`${this.apiUrl}/extract`, payload);
  }
}