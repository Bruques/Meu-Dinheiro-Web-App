import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState, User } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private http: HttpClient = inject(HttpClient);
  private apiUrl = 'https://meu-dinheiro-backend-production.up.railway.app/api/users';
  
  // Fica observando se o usuário está logado ou não
  public readonly user$: Observable<User | null> = authState(this.auth);

  // Login
  login(email: string, senha: string) {
    return signInWithEmailAndPassword(this.auth, email, senha);
  }

  // Cadastro (Opcional para você criar a sua própria conta)
  registrar(email: string, senha: string) {
    return createUserWithEmailAndPassword(this.auth, email, senha);
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }

  // Pega o Token VIP para mandar para o Java depois
  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return user.getIdToken();
    }
    return null;
  }

  async syncUser(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    // ATENÇÃO: Ajuste a URL abaixo se o seu backend estiver em outro endereço/porta
    const url = this.apiUrl + '/sync'; 
    
    // firstValueFrom transforma o Observable do Angular em uma Promise para usarmos async/await
    return firstValueFrom(this.http.post(url, {}, { headers }));
  }
}