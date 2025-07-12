import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from "../../components/header/header";

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, Header],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  constructor() {
    console.log('DashboardPage initialized');
  }
}
