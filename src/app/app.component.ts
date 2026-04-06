import { Component, signal } from '@angular/core';
import { ExpenseInputComponent } from './components/expense-input/expense-input.component';

@Component({
  selector: 'app-root',
  imports: [ExpenseInputComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('meudinheirowebapp');
}
