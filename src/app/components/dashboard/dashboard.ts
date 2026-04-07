import { Component, OnInit } from '@angular/core';
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

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.carregarGastos();

    // Fica escutando: se alguém avisar, recarrega a tabela automaticamente!
    this.expenseService.expenseAdded$.subscribe(() => {
      this.carregarGastos();
    });
  }

  carregarGastos() {
    this.expenseService.getExpenses().subscribe({
      next: (dados) => {
        this.expenses = dados;
        this.calcularTotal();
      },
      error: (err) => console.error('Erro ao buscar gastos', err)
    });
  }

  calcularTotal() {
    this.totalGasto = this.expenses.reduce((acc, gasto) => acc + gasto.value, 0);
  }
}