import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ExpenseService } from '../../services/expense';

declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

@Component({
  selector: 'app-expense-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './expense-input.component.html',
  styleUrl: './expense-input.component.css'
})
export class ExpenseInputComponent {
  expenseControl = new FormControl(''); // O dono oficial do texto
  isLoading = false;
  savedExpenses: any[] = [];
  isRecording: boolean = false;

  // Adicionamos o NgZone aqui no construtor
  constructor(
    private expenseService: ExpenseService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  onSubmit() {
    const text = this.expenseControl.value;

    if (text && text.trim() !== '') {
      this.isLoading = true;
      this.savedExpenses = [];

      this.expenseService.extractExpense(text).subscribe({
        next: (result: any[]) => {
          this.savedExpenses = result;
          this.isLoading = false;
          this.expenseControl.reset();

          this.cdr.detectChanges();

          setTimeout(() => {
            this.expenseService.notifyExpenseAdded();
            this.savedExpenses = [];

            this.cdr.detectChanges();
          }, 2000);
        },
        error: (err) => {
          console.error('Erro ao processar', err);
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Ops! Ocorreu um erro na comunicação com a IA.');
        }
      });
    }
  }

  iniciarGravacao() {
    const SpeechRecognitionReference = webkitSpeechRecognition || SpeechRecognition;

    if (!SpeechRecognitionReference) {
      alert('Seu navegador não suporta gravação de áudio por aqui. Tente usar o Chrome!');
      return;
    }

    const recognition = new SpeechRecognitionReference();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;

    recognition.onstart = () => {
      this.ngZone.run(() => {
        this.isRecording = true;
        this.cdr.detectChanges();
      });
    };

    recognition.onresult = (event: any) => {
      const textoFalado = event.results[0][0].transcript;

      this.ngZone.run(() => {
        // 1. MÁGICA DA UX: Desliga a gravação imediatamente!
        // Isso faz o botão parar de piscar na hora.
        this.isRecording = false;
        this.cdr.detectChanges();
        // 2. Coloca o texto falado dentro do campo de texto
        this.expenseControl.setValue(textoFalado);

        // 3. Chama o onSubmit direto! O usuário não precisa clicar em enviar.
        // O onSubmit vai setar o isLoading = true, mudando o botão para "Processando..."
        this.onSubmit();
      });
    };

    recognition.onerror = (event: any) => {
      console.error('Erro ao gravar: ', event.error);
      this.ngZone.run(() => { this.isRecording = false; });
    };

    recognition.onend = () => {
      // Fallback de segurança: se a pessoa não falar nada e o tempo acabar, ele desliga.
      this.ngZone.run(() => {
         this.isRecording = false; 
         this.cdr.detectChanges();
        });
    };

    recognition.start();
  }
}