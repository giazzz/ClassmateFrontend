import {Component, OnInit} from '@angular/core';
import { navItems } from '../../_nav';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { AuthenticationService } from '../../_services';
import { DashboardService } from '../../views/dashboard/dashboard.service';

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

  constructor(private routeActive: ActivatedRoute,
              public router: Router,
              private authenService: AuthenticationService,
              private courseService: DashboardService,
  ) {
  }

  public ngOnInit(): void {
    // Get id user logged from session storage:
    this.userId = JSON.parse(localStorage.currentUser).id || '';
    this.classId = this.router.url.split('/')[2];

    this.router.events.subscribe((events) => {
      if (events instanceof NavigationStart) {
        if (events.url.includes('class')) {
          this.classId = events.url.split('/')[2];
        }
      }
    });

    // this.courseService.getAllCourse().subscribe(
    //   response => {
    //     if (response.body != null && response.body !== undefined) {
    //       const lstALlCourse = response.body;

    //     }
    //   });

  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.authenService.logout();
    this.router.navigateByUrl('/login');
  }

}
