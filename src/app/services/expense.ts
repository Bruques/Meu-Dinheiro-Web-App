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

  getExpensesByMonth(mes: number, ano: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes?mes=${mes}&ano=${ano}`);
  }

  // Adicione abaixo do getExpenses()
  deleteExpense(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateExpense(id: number, expenseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, expenseData);
  }

  // Método que dispara a notificação
  notifyExpenseAdded() {
    this.expenseAddedSource.next();
  }
}