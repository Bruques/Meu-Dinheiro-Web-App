import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private http = inject(HttpClient);
  
  // Coloque a URL do seu Railway aqui depois, por enquanto usamos o localhost
  private apiUrl = 'https://meu-dinheiro-backend-production.up.railway.app/api/users'; 

  // Chama o Java enviando o UID e o Email do Firebase
  gerarCodigoWhatsapp(uid: string, email: string): Observable<string> {
    // O { responseType: 'text' } é necessário porque o Java devolve apenas uma String ("123456") e não um JSON completo
    return this.http.post(`${this.apiUrl}/gerar-codigo?uid=${uid}&email=${email}`, {}, { responseType: 'text' });
  }

  // Adicione isso abaixo do seu gerarCodigoWhatsapp
  verificarSeTemWhatsapp(uid: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/tem-whatsapp/${uid}`);
  }
}