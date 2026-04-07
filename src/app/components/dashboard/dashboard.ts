import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Adicione o ChangeDetectorRef aqui
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  expenses: any[] = [];
  totalGasto: number = 0;

  // Controle de edição
  editandoId: number | null = null;
  gastoEmEdicao: any = {};

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

 

  // Método de Excluir
  excluirGasto(id: number) {
    if (confirm('Tem certeza que deseja excluir este gasto?')) {
      this.expenseService.deleteExpense(id).subscribe(() => {
        this.carregarGastos(); // Recarrega a lista
      });
    }
  }

  // Métodos de Edição
  iniciarEdicao(expense: any) {
    this.editandoId = expense.id;
    // Cria uma cópia do objeto para não mexer na tabela antes de salvar
    this.gastoEmEdicao = { ...expense }; 
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.gastoEmEdicao = {};
  }

  salvarEdicao() {
    if (this.editandoId) {
      this.expenseService.updateExpense(this.editandoId, this.gastoEmEdicao).subscribe(() => {
        this.editandoId = null;
        this.carregarGastos(); // Recarrega com os dados novos
      });
    }
  }


}