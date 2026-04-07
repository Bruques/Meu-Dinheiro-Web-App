import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  // A URL do nosso Spring Boot
  private apiUrl = 'http://localhost:8080/api/expenses';

  // O "transmissor" do aviso
  private expenseAddedSource = new Subject<void>();
  
  // O "canal" que o Dashboard vai escutar
  expenseAdded$ = this.expenseAddedSource.asObservable();

  // Injetamos o HttpClient no construtor
  constructor(private http: HttpClient) { }

  // Método que envia o texto para o backend
  extractExpense(text: string): Observable<any> {
    const payload = { text: text };
    return this.http.post<any>(`${this.apiUrl}/extract`, payload);
  }

  // Adicione isso logo abaixo do método extractExpense
  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método que dispara a notificação
  notifyExpenseAdded() {
    this.expenseAddedSource.next();
  }
}