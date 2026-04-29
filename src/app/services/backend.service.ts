import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/users`;

  // Chama o Java enviando o UID e o Email do Firebase
  gerarCodigoWhatsapp(uid: string, email: string): Observable<string> {
    // O { responseType: 'text' } é necessário porque o Java devolve apenas uma String ("123456") e não um JSON completo
    return this.http.post(`${this.apiUrl}/gerar-codigo?uid=${uid}&email=${email}`, {}, { responseType: 'text' });
  }

  // Adicione isso abaixo do seu gerarCodigoWhatsapp
  verificarSeTemWhatsapp(uid: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/tem-whatsapp/${uid}`);
  }

  getCategoriasDoUsuario(uid: string) {
    // Ajuste '/users' para o caminho base do seu Controller no Spring Boot
    return this.http.get<string[]>(`${this.apiUrl}/${uid}/categorias`); 
}
}