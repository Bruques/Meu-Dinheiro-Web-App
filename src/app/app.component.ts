import { Component, signal } from '@angular/core';
import { ExpenseInputComponent } from './components/expense-input/expense-input.component';
import { DashboardComponent } from './components/dashboard/dashboard'; // <-- Importe aqui

@Component({
  selector: 'app-root',
  imports: [ExpenseInputComponent, DashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('meudinheirowebapp');
}
