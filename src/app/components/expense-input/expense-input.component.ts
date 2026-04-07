import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ExpenseService } from '../../services/expense'; // Importamos o serviço

@Component({
  selector: 'app-expense-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-input.component.html',
  styleUrl: './expense-input.component.css'
})
export class ExpenseInputComponent {
  expenseControl = new FormControl('');
  isLoading = false; // Controla se estamos esperando a IA
  savedExpense: any = null; // Guarda o gasto salvo para mostrar na tela

  // Injetamos o serviço no construtor
  constructor(private expenseService: ExpenseService) {}

  onSubmit() {
    const text = this.expenseControl.value;
    
    // Verifica se o texto não está vazio
    if (text && text.trim() !== '') {
      this.isLoading = true;
      this.savedExpense = null;

      // Chama a nossa API via serviço (assina o Observable)
      this.expenseService.extractExpense(text).subscribe({
        next: (result) => {
          // Deu certo! O Spring Boot devolveu o dado salvo no banco
          this.savedExpense = result;
          this.isLoading = false;
          this.expenseControl.reset(); // Limpa o campo

          this.expenseService.notifyExpenseAdded;
        },
        error: (err) => {
          console.error('Erro ao processar', err);
          this.isLoading = false;
          alert('Ops! Ocorreu um erro na comunicação com a IA.');
        }
      });
    }
  }
}