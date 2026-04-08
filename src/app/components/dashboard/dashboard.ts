import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Adicionado para redirecionar

// Import dos Serviços e Componentes
import { ExpenseService } from '../../services/expense'; 
import { AuthService } from '../../services/auth'; // O Serviço do Firebase
import { ExpenseInputComponent } from '../expense-input/expense-input.component'; // O Componente do Modal

// Imports do Gráfico
import { BaseChartDirective } from 'ng2-charts'; 
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, ExpenseInputComponent], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  // --- VARIÁVEIS DO MODAL ---
  isModalOpen = false;

  // --- VARIÁVEIS DO DASHBOARD ---
  expenses: any[] = [];
  totalMes: number = 0; 
  dataAtual = new Date();
  mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  editandoId: number | null = null;
  gastoEmEdicao: any = {};

  // Configuração do Gráfico de Rosca
  public pieChartType: ChartType = 'doughnut';
  public pieChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{ 
      data: [], 
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };
  public pieChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false };

  // Construtor atualizado com Auth e Router
  constructor(
    private expenseService: ExpenseService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // 1. O "SEGURANÇA": Verifica se o usuário está logado
    this.authService.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']); // Expulsa para o login
      } else {
        this.carregarGastosDoMes(); // Se tem crachá, carrega os dados
      }
    });

    // 2. O "OUVIDO DA IA": Escuta quando o modal salva um gasto
    this.expenseService.expenseAdded$.subscribe(() => {
      this.fecharModal(); // Desce o modal
      this.carregarGastosDoMes(); // Atualiza a lista e o gráfico
    });
  }

  // --- CONTROLE DO MODAL ---
  abrirModal() { 
    this.isModalOpen = true; 
  }
  
  fecharModal() { 
    this.isModalOpen = false; 
    this.cdr.detectChanges(); 
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

  // --- MÉTODOS DE EDIÇÃO E EXCLUSÃO ---
  excluirGasto(id: number) {
    if (confirm('Tem certeza que deseja excluir este gasto?')) {
      this.expenseService.deleteExpense(id).subscribe(() => {
        this.carregarGastosDoMes(); 
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
        this.carregarGastosDoMes(); 
      });
    }
  }
}