import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';
  isLoginMode = true; // Alterna entre Login e Cadastro
  erroMensagem = '';

  alternarModo() {
    this.isLoginMode = !this.isLoginMode;
    this.erroMensagem = '';
  }

  async submeter() {
    if (!this.email || !this.senha) {
      this.erroMensagem = 'Preencha todos os campos.';
      return;
    }

    try {
      if (this.isLoginMode) {
        await this.authService.login(this.email, this.senha);
      } else {
        await this.authService.registrar(this.email, this.senha);
      }
      
      // Se deu tudo certo, pega o Token VIP e vai pro Dashboard!
      const token = await this.authService.getToken();
      console.log('Login Sucesso! Meu Token JWT é:', token);
      this.router.navigate(['/dashboard']);
      
    } catch (error: any) {
      this.erroMensagem = 'Falha na autenticação. Verifique seus dados.';
      console.error(error);
    }
  }
}