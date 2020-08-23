import {Component, OnInit} from '@angular/core';
import { navItems } from '../../_nav';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = navItems;
  public classId: string;
  public userId: string;

  constructor(private routeActive: ActivatedRoute, private router: Router
  ) {}

  public ngOnInit(): void {
    // Get id user logged from session storage:
    this.userId = sessionStorage.id || '';

    this.classId = this.router.url.substr(7, 1);
    this.router.events.subscribe((events) => {
      if (events instanceof NavigationStart) {
        if (events.url.includes('class')) {
          this.router.routerState.root.snapshot.paramMap.get('id');
          this.classId = events.url.substr(7, 1);
          // Get id user logged from session storage:
          this.userId = sessionStorage.id;
        }
      }
    });
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

}
