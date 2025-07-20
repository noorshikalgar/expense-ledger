import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    RouterOutlet,
    Header,
    ButtonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  sidebarLinks = [
    { label: 'Dashboard', icon: 'pi pi-th-large', route: '/dashboard' },
    { label: 'Transactions', icon: 'pi pi-list', route: '/dashboard/transactions' },
    { label: 'Accounts', icon: 'pi pi-wallet', route: '/dashboard/accounts' },
    { label: 'Cards', icon: 'pi pi-credit-card', route: '/cards' },
    { label: 'UPIs', icon: 'pi pi-qrcode', route: '/upis' },
    { label: 'Splits', icon: 'pi pi-share-alt', route: '/splits' },
  ];

  constructor() {
    console.log('DashboardPage initialized');
  }
}
