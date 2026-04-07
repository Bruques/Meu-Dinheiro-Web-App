import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Adicione o ChangeDetectorRef aqui
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  expenses: any[] = [];
  totalGasto: number = 0;

  // 2. Injete o ChangeDetectorRef no construtor (cdr)
  constructor(
    private expenseService: ExpenseService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.carregarGastos();

    // Quando o serviço avisar que um item foi adicionado, recarregamos
    this.expenseService.expenseAdded$.subscribe(() => {
      this.carregarGastos();
    });
  }

  carregarGastos() {
    this.expenseService.getExpenses().subscribe({
      next: (dados) => {
        this.expenses = dados;
        this.calcularTotal();
        
        // 3. O SEGREDO: Avisa o Angular explicitamente para atualizar a tela AGORA!
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Erro ao buscar gastos', err)
    });
  }

  calcularTotal() {
    this.totalGasto = this.expenses.reduce((acc, gasto) => acc + gasto.value, 0);
  }
}