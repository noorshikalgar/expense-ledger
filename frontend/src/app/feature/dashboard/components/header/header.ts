import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu'; // For direct menu control
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    MenuModule,
    MenubarModule,
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  userService = inject(UserService);
  router = inject(Router);
  authService = inject(AuthService);  
  
  userInfo = this.userService.getLocalUserInfo();
  userName: string = `${this.userInfo.first_name} ${this.userInfo.last_name}`;
  initials: string = this.getUserNameInitials(); // Initials

  isLoggedIn: boolean = this.userService.isUserLoggedIn(); // Simulate login state
  profileMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {
        this.router.navigate(['/profile']); // Navigate to profile page
      },
    },
    {
      separator: true,
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.logout(); // Call your logout method
      },
    },
  ];

  // Used to control the p-menu component directly
  @ViewChild('profileMenu') profileMenu: Menu | undefined;

  // Method to open the profile menu programmatically
  // This is useful if you want to click on the avatar/name itself to toggle the menu
  toggleProfileMenu(event: Event) {
    if (this.profileMenu) {
      this.profileMenu.toggle(event);
    }
  }

  logout(): void {
    this.authService.removeAuthTokens();
    this.userService.setUserInfo({}); // Clear user info
    this.router.navigate(['/login']);
  }

  getUserNameInitials(): string {
    return (
      this.userName.split(' ')[0][0].toLocaleUpperCase() +
      this.userName.split(' ')[1][0].toLocaleUpperCase()
    );
  }
}
