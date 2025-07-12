import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-summary',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss'
})
export class Summary {

}
