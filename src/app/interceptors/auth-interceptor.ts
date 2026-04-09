import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Como pegar o token no Firebase é assíncrono (Promise), usamos o 'from' do RxJS
  return from(authService.getToken()).pipe(
    switchMap(token => {
      // Se o usuário estiver logado e tivermos o token
      if (token) {
        // Clonamos a requisição e adicionamos o cabeçalho de Autorização
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(clonedReq); // Envia para o Java COM o token
      }
      
      // Se não tiver token (ex: deslogado), manda a requisição original normal
      return next(req);
    })
  );
};