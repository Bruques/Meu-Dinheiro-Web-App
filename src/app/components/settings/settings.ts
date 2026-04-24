import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  private baseApiUrl = 'https://meu-dinheiro-backend-production.up.railway.app/api'

  // Valores padrões (depois podemos fazer um GET para buscar do banco ao abrir a tela)
  diaFechamento: number = 21;
  diaVencimento: number = 24;
  
  salvando: boolean = false;
  carregando: boolean = true;

  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';

  ngOnInit() {
    this.buscarConfiguracoes();
  }

  async buscarConfiguracoes() {
    try {
      const token = await this.authService.getToken();
      if (!token) return;

      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${this.baseApiUrl}/users/config`;

      this.http.get<any>(url, { headers }).subscribe({
        next: (dados) => {
          this.diaFechamento = dados.fechamento;
          this.diaVencimento = dados.vencimento;
          this.carregando = false;
          this.cdr.detectChanges(); // Atualiza a tela com os novos números
        },
        error: (erro) => {
          console.error('Erro ao buscar configurações', erro);
          this.carregando = false;
          this.cdr.detectChanges();
        }
      });
    } catch (error) {
      console.error('Erro de autenticação ao buscar dados:', error);
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  async salvarConfiguracoesCartao() {
    // Validação básica
    if (this.diaFechamento < 1 || this.diaFechamento > 31 || this.diaVencimento < 1 || this.diaVencimento > 31) {
      this.mostrarMensagem('Os dias devem ser entre 1 e 31.', 'erro');
      return;
    }

    this.salvando = true;

    try {
      const token = await this.authService.getToken();
      const user = this.authService.auth.currentUser;

      if (!token || !user) {
        throw new Error('Usuário não autenticado.');
      }

      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${this.baseApiUrl}/users/atualizar-fatura?uid=${user.uid}&fechamento=${this.diaFechamento}&vencimento=${this.diaVencimento}`;

      // A MUDANÇA: Trocamos o await/firstValueFrom pelo .subscribe()
      this.http.post(url, {}, { headers, responseType: 'text' }).subscribe({
        next: (resposta) => {
          // Deu certo! (Status 200)
          this.mostrarMensagem('Configurações atualizadas com sucesso! 🚀', 'sucesso');
          this.salvando = false; // Destrava o botão
          this.cdr.detectChanges();
        },
        error: (erro) => {
          // Deu erro! (Status 4xx ou 5xx)
          console.error('Erro na chamada HTTP:', erro);
          this.mostrarMensagem('Falha ao salvar as configurações.', 'erro');
          this.salvando = false; // Destrava o botão
          this.cdr.detectChanges();
        }
      });
      
    } catch (error) {
      // Erro caso o token falhe antes mesmo de chamar a API
      console.error('Erro de autenticação:', error);
      this.mostrarMensagem('Falha ao validar usuário.', 'erro');
      this.salvando = false; // Destrava o botão
      this.cdr.detectChanges();
    }
  }

  mostrarMensagem(msg: string, tipo: 'sucesso' | 'erro') {
    this.mensagem = msg;
    this.tipoMensagem = tipo;
    this.cdr.detectChanges(); 
    
    setTimeout(() => {
      this.mensagem = '';
      this.cdr.detectChanges(); 
    }, 4000);
  }
}