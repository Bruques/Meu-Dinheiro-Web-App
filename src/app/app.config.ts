import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { authInterceptor } from './interceptors/auth-interceptor';

const firebaseConfig = {
  apiKey: "AIzaSyCfTNP6K0c0Ixufkdwy6EtVLhnvqtCgTN8",
  authDomain: "meu-dinheiro-app-b75e2.firebaseapp.com",
  projectId: "meu-dinheiro-app-b75e2",
  storageBucket: "meu-dinheiro-app-b75e2.firebasestorage.app",
  messagingSenderId: "73597846491",
  appId: "1:73597846491:web:cca8e058c31b6d4d3d9dfe"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // Inicializa o Aplicativo do Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    
    // Inicializa o serviço de Autenticação (Login)
    provideAuth(() => getAuth())
  ]
};

