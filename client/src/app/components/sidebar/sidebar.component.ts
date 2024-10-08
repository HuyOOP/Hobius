import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { filter, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SharedModule, MaterialModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription[] = [];

  links = [
    {
      name: 'Admin',
      icon: 'shield_person',
      routeLink: '/admin',
      isActive: false,
    },
    { name: 'Home', icon: 'home', routeLink: '/home', isActive: false },
    {
      name: 'Profile',
      icon: 'person',
      routeLink: '/profile',
      isActive: false,
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event) => {
          this.links.forEach((link) => {
            link.isActive = this.router.url.includes(link.routeLink);
          });
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  navigate(index: number) {
    this.router.navigate([this.links[index].routeLink]).then(() => {});
  }
}
