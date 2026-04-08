import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense'; // Confirme se o caminho do seu import é esse mesmo
import { BaseChartDirective } from 'ng2-charts'; // O import do Gráfico!
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective], // BaseChartDirective adicionado aqui!
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  expenses: any[] = [];
  totalMes: number = 0; // Alterado de totalGasto para refletir o mês

  // Controle do Tempo
  dataAtual = new Date();
  mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Controle de edição (Os seus métodos originais intactos)
  editandoId: number | null = null;
  gastoEmEdicao: any = {};

  // Configuração do Gráfico de Rosca (Doughnut)
  public pieChartType: ChartType = 'doughnut';
  public pieChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{ 
      data: [], 
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };
  public pieChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false };

  // O seu construtor já com o ChangeDetectorRef injetado
  constructor(
    private expenseService: ExpenseService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.carregarGastosDoMes(); // Agora carrega por mês

    this.expenseService.expenseAdded$.subscribe(() => {
      this.carregarGastosDoMes();
    });
  }

  // --- NAVEGAÇÃO DE MESES ---
  mudarMes(delta: number) {
    this.dataAtual.setMonth(this.dataAtual.getMonth() + delta);
    this.dataAtual = new Date(this.dataAtual); 
    this.carregarGastosDoMes();
  }

  get nomeMesAtual(): string {
    return this.mesesNomes[this.dataAtual.getMonth()];
  }

  get anoAtual(): number {
    return this.dataAtual.getFullYear();
  }

  // --- BUSCA E MATEMÁTICA ---
  carregarGastosDoMes() {
    const mesJava = this.dataAtual.getMonth() + 1; 
    const anoJava = this.dataAtual.getFullYear();

    this.expenseService.getExpensesByMonth(mesJava, anoJava).subscribe({
      next: (dados) => {
        this.expenses = dados;
        this.calcularTotaisEGrafico();
        
        // Mantemos o seu segredo para evitar erros de renderização!
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Erro ao buscar gastos do mês', err)
    });
  }

  calcularTotaisEGrafico() {
    this.totalMes = 0;
    const categoriasMapa: any = {};

    this.expenses.forEach(exp => {
      this.totalMes += exp.value;
      
      if (categoriasMapa[exp.category]) {
        categoriasMapa[exp.category] += exp.value;
      } else {
        categoriasMapa[exp.category] = exp.value;
      }
    });

    this.pieChartData.labels = Object.keys(categoriasMapa);
    this.pieChartData.datasets[0].data = Object.values(categoriasMapa);
    this.pieChartData = { ...this.pieChartData }; 
  }

  // --- MÉTODOS DE EDIÇÃO E EXCLUSÃO (Agora recarregam o mês atual) ---
  excluirGasto(id: number) {
    if (confirm('Tem certeza que deseja excluir este gasto?')) {
      this.expenseService.deleteExpense(id).subscribe(() => {
        this.carregarGastosDoMes(); // Atualizado
      });
    }
  }

  iniciarEdicao(expense: any) {
    this.editandoId = expense.id;
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
        this.carregarGastosDoMes(); // Atualizado
      });
    }
  }
}