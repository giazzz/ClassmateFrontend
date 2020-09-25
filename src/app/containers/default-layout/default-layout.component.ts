import { Component, OnInit } from '@angular/core';
import { navItems } from '../../_nav';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { AuthenticationService } from '../../_services';
import { DashboardService } from '../../views/dashboard/dashboard.service';
import * as $ from 'jquery';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { INavData } from '@coreui/angular';
import { SettingService } from '../../views/setting/setting.service';
import { EndpointsConfig } from '../../config/config';
import { MarkService } from '../../views/mark/mark.service';

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
  public totalCourse: number = 0;
  public totalEx: number = 0;
  public currentUser;
  public objProfile;
  public isTeacher: boolean = false;
  public isStudent: boolean = false;
  public lstAllCourse: any[];
  public driveUrl = EndpointsConfig.google.driveUrl;
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;

  public nav = [
    {
      title: true,
      name: 'Chức năng'
    },
    {
      name: 'Danh sách lớp',
      url: '/dashboard',
      icon: 'icon-briefcase',
    },
    // {
    //   name: 'Thời khóa biểu',
    //   url: '/schedule',
    //   icon: 'icon-calendar'
    // },
    // {
    //   name: 'Quản lý sinh viên',
    //   url: '/manage',
    //   icon: 'icon-folder-alt'
    // },
    // {
    //   name: 'To do',
    //   url: '/student/1/todo',
    //   icon: 'icon-notebook'
    // },
    {
      name: 'Cá nhân',
      url: '/setting',
      icon: 'icon-user'
    },
  ];

  constructor(private routeActive: ActivatedRoute,
              public router: Router,
              private authenService: AuthenticationService,
              private dashBoardService: DashboardService,
              private iconLoading: NgxUiLoaderService,
              private settingService: SettingService,
              private markService: MarkService
  ) {
  }

  ngOnInit() {
    // Get id user logged from session storage:
    this.currentUser = JSON.parse(localStorage.currentUser);
    this.userId = this.currentUser.id;
    if (!this.router.url.includes('student')) {
      this.classId = this.router.url.split('/')[2];
    }
    this.lstAllCourse = [];
    this.isTeacher = JSON.parse(localStorage.currentUser).roles.includes('ROLE_TEACHER');
    this.isStudent = JSON.parse(localStorage.currentUser).roles.includes('ROLE_STUDENT');

    this.settingService.getProfile(JSON.parse(localStorage.currentUser).id || '').subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objProfile = response.body;
        }
      });

    this.router.events.subscribe((events) => {
      if (events instanceof NavigationStart) {
        if (events.url.includes('class') && !this.router.url.includes('student')) {
          this.classId = events.url.split('/')[2];
        }
      }
    });
    this.getLstAllCourse();
    this.getTotalExNotSubmmit();
  }

  getLstAllCourse() {
    this.lstAllCourse = [];
    if (this.currentUser.roles.includes('ROLE_TEACHER')) {
      this.dashBoardService.getTeacherCourse().subscribe(
        response => {
          if (response.body !== null && response.body !== undefined) {
            this.totalCourse = 0;
            this.lstAllCourse.unshift(
              {
                title: true,
                name: 'Lớp học'
              });
            response.body.filter(item => item.status === 'ONGOING' || item.status === 'PENDING').forEach(item => {
              this.totalCourse++;
              this.lstAllCourse.push(
                {
                  name: item.name,
                  url: `/class/${item.id}/stream`,
                  icon: 'icon-graduation'
                });
            });
            this.nav.push(
              {
                name: 'Quản lý sinh viên',
                url: '/management',
                icon: 'icon-folder-alt'
              });
            // if (this.classId != null && this.classId !== undefined) {
            //   this.lstAllCourse.push(
            //     {
            //       name: 'Cài đặt',
            //       url: `/class/${this.classId}/setting`,
            //       icon: 'icon-settings'
            //     });
            // }
            this.navItems = this.lstAllCourse.concat(this.nav);
          }
          this.iconLoading.stop();
        },
        error => {
          this.iconLoading.stop();
        });
    } else if (this.currentUser.roles.includes('ROLE_STUDENT')) {
      this.dashBoardService.getStudentCourse().subscribe(
        response => {
          if (response.body !== null && response.body !== undefined) {
            this.totalCourse = 0;
            this.lstAllCourse.unshift(
              {
                title: true,
                name: 'Lớp học'
              });
            response.body.filter(item => item.status === 'ONGOING' || item.status === 'PENDING').forEach(item => {
              this.totalCourse++;
              if (this.lstAllCourse.length <= 10) {
                this.lstAllCourse.push(
                  {
                    name: item.name,
                    url: `/class/${item.id}/stream`,
                    icon: 'icon-graduation'
                  });
              }
            });
            this.navItems = this.lstAllCourse.concat(this.nav);
          }
          this.iconLoading.stop();
        },
        error => {
          this.iconLoading.stop();
        });
    }
  }

  getTotalExNotSubmmit() {
    this.markService.getStudentAllExcercise().subscribe(
      response => {
        if (response.body !== null && response.body !== undefined) {
          response.body.forEach(item => {
            item.gradeRecordResponses.forEach(ex => {
              this.totalEx += ex.studentExerciseResponse.submitted ? 0 : 1;
            });
          });
        }
      });
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.authenService.logout();
    this.router.navigateByUrl('/login');
  }

}
