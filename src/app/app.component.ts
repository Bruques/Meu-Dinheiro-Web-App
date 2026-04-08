import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para o *ngIf
import { ExpenseInputComponent } from './components/expense-input/expense-input.component';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ExpenseService } from './services/expense';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExpenseInputComponent, DashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isModalOpen = false;

  constructor(
    private expenseService: ExpenseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Escutamos a mesma "buzina" que atualiza a tabela.
    // Quando a despesa for salva, o modal desce automaticamente!
    this.expenseService.expenseAdded$.subscribe(() => {
      console.log("Recebi o aviso! Fechando o modal agora...");
      this.fecharModal();
    });
  }

  abrirModal() { 
    this.isModalOpen = true; 
  }
  
  fecharModal() { 
    this.isModalOpen = false; 
    this.cdr.detectChanges();
  }
}