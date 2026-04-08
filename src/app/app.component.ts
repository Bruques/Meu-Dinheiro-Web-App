import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para o *ngIf
import { RouterOutlet } from '@angular/router'; // 1. Importe o RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}