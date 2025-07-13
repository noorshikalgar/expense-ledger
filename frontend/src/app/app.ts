import { Component, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'frontend';

  loadingService = inject(LoadingService);
  router = inject(Router);
  
  loading$ = this.loadingService.loading$;
  private destroy$ = new Subject<void>();

  constructor() {
    console.log('App component initialized');
  }

  ngOnInit() {
    console.log('App component ngOnInit called');
        this.router.events
      .pipe(
        // Filter for specific router events
        filter(
          (event: any) =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        ),
        takeUntil(this.destroy$) // Unsubscribe when component is destroyed
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          // Navigation started, show loading
          this.loadingService.show();
          console.log('Navigation Started: Showing Loading Indicator');
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          // Navigation ended (successfully, cancelled, or with an error), hide loading
          this.loadingService.hide();
          console.log('Navigation Ended: Hiding Loading Indicator');
          if (event instanceof NavigationError) {
            console.error('Navigation Error:', event.error);
            // Optionally, handle specific navigation errors here
          }
        }
      });
  }
}
