import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EndpointsConfig } from '../../config/config';
import { CheckRole } from '../../shared/checkRole';
import { Toastr } from '../../shared/toastr';
import { DashboardService } from '../dashboard/dashboard.service';
import { ManagerService } from './management.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss',
              '../attendance/attendance-by-teacher/attendance-by-teacher.component.scss']
})
export class ManagementComponent implements OnInit {

  public lstAllCourse = [];
  public lstAllCheckResult = [];
  public lstSessionOfCourse = [];
  public lstStudentOfSession = [];
  public strSelectedCourseId = '';
  public strSelectedSessionId = '';
  public totalStudent = 0;
  public totalStudentAttend = 0;
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;
  public driveUrl = EndpointsConfig.google.driveUrl;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public role: CheckRole,
              private iconLoading: NgxUiLoaderService,
              private toastr: Toastr,
              private managerService: ManagerService,
              private dashBoardService: DashboardService,
  ) {
  }

  ngOnInit(): void {
    this.getLstAllCourse();
  }

  getLstAllCourse() {
    this.dashBoardService.getTeacherCourse().subscribe(
      response => {
        if (response.body !== null && response.body !== undefined) {
          this.lstAllCourse = response.body.filter(item => item.status === 'ONGOING' || item.status === 'PENDING');
        }
      });
  }

  onChangeSelectCourse() {
    if (this.strSelectedCourseId === '' || this.strSelectedCourseId === null || this.strSelectedCourseId === undefined) {
      return;
    }
    this.managerService.getListAllCheckResult(this.strSelectedCourseId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.lstAllCheckResult = response.body.filter(item => item.sessionResponse.status === 'END');
          this.lstSessionOfCourse = response.body.filter(item => item.sessionResponse.status === 'END').map(item => {
            return {
              session_id: item.sessionResponse.id,
              session_name: 'Buổi học ' + this.convertTickToDateShort(item.sessionResponse.start_time),
            };
          });
        }
      });
  }

  onChangeSelectSession() {
    if (this.strSelectedSessionId === '' || this.strSelectedSessionId === null || this.strSelectedSessionId === undefined) {
      return;
    }
    const ss = this.lstAllCheckResult.find(item => item.sessionResponse.id === this.strSelectedSessionId);
    this.lstStudentOfSession = ss.attendanceCheckResponseList;
    this.totalStudent = ss.attendanceCheckResponseList.length;
    this.totalStudentAttend = ss.attendanceCheckResponseList.filter(s => s.status !== 'ATTENDANT').length;
  }

  convertTickToDateShort(tick) {
    const date = new Date(Number(tick));
    return moment(date).format('D & M YYYY').replace('&', 'thg');
  }

}
