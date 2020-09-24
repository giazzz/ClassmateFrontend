import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EndpointsConfig } from '../../../config/config';
import { CheckRole } from '../../../shared/checkRole';
import { Toastr } from '../../../shared/toastr';
import { ClassRoomService } from '../../class-room/class-room.service';
import { SessionService } from '../../class-room/session.service';
import { ClassMateService } from '../../classmate.service';
import { AttendanceService } from '../attendance.service';

@Component({
  selector: 'app-attendance-by-teacher',
  templateUrl: './attendance-by-teacher.component.html',
  styleUrls: ['./attendance-by-teacher.component.scss']
})
export class AttendanceByTeacherComponent implements OnInit {

  public courseId;
  public objCourse;
  public lstStudentResult = [];
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;
  public driveUrl = EndpointsConfig.google.driveUrl;
  public totalStudent = 0;
  public totalStudentAttend = 0;

  @ViewChild('addSessionModal') public addSessionModal: ModalDirective;
  @ViewChild('updateStatusCourseModal') public updateStatusCourseModal: ModalDirective;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public role: CheckRole,
              private iconLoading: NgxUiLoaderService,
              private sessionService: SessionService,
              private toastr: Toastr,
              private classService: ClassMateService,
              private attendService: AttendanceService,
              private classRoomService: ClassRoomService
  ) {
  }

  ngOnInit(): void {
    this.iconLoading.start();
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId == null || this.courseId === undefined || this.courseId === 'undefined') {
      this.router.navigateByUrl('/dashboard');
    }

    this.getCurrentCourse();
  }

  getCurrentCourse() {
    this.classService.getClassDetail(this.courseId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objCourse = response.body;
          this.getListStudentResult();
        }
        this.iconLoading.stop();
      },
      error => {
        this.iconLoading.stop();
      });
  }

  getListStudentResult() {
    this.attendService.getAllStudentWithAttendanceResult(this.objCourse?.currentSession.id).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.lstStudentResult = response.body;
          this.totalStudent = response.body.length;
          this.totalStudentAttend = response.body.filter(item => item.status !== 'ATTENDANT').length;
        }
      });
  }

  // Update status course to ONGOING
  onChangeUpdateStatusCourse(e) {
    if (!e.target.checked) {
      return;
    }
    this.classRoomService.updateCourseStatus(this.objCourse.id).subscribe(
      response => {
        if (response.http_status === 'OK' && response.success) {
          // Success:
          this.toastr.showToastrSuccess('', 'Thành công!');
          this.getCurrentCourse();
          this.updateStatusCourseModal.hide();
        }
      },
      error => {
        // Error:
        this.toastr.showToastrWarning('', 'Không thành công');
        e.target.checked = false;
        this.updateStatusCourseModal.hide();
      });
  }

  // Add new session and set ONGOING:
  onChangeAddSession(e) {
    if (!e.target.checked) {
      return;
    }
    const now = new Date();
    const objSession = {
      course_id: this.objCourse.id,
      name: 'Buổi học ' + moment(now).format('DD/MM/YYYY'),
      content: this.objCourse.name,
      start_time: now.getTime(),
      session_duration: 4,
    };
    this.sessionService.createSession(objSession).subscribe(
      response => {
        if (response.status === 200 && response.body.success) {
          const sessionId = response.body.content.id;
          // Update to ONGOING:
          this.sessionService.updateStatusToGoing(sessionId).subscribe(
            data => {
              if (data.http_status === 'OK' && data.success) {
                // Success:
                this.getCurrentCourse();
                this.toastr.showToastrSuccess('Bạn đã bắt đầu một buổi học', 'Thành công!');
                this.addSessionModal.hide();
              }
            },
            error => {
              // Error:
              this.toastr.showToastrWarning('', 'Không thành công');
              this.addSessionModal.hide();
            });
        }
        this.addSessionModal.hide();
      },
      error => {
        // Error:
        this.toastr.showToastrWarning('', 'Không thành công');
        e.target.checked = false;
        this.addSessionModal.hide();
      });
  }

  // Allow attendance:
  onChangeAllowAttend(e) {
    const blnAllow: boolean = e.target.checked;
    const currentStatus = this.objCourse?.currentSession.attendance_status;

    if (blnAllow && currentStatus !== 'ONGOING') {
      this.sessionService.startAttendandeCheck(this.objCourse?.currentSession.id).subscribe(
        response => {
          if (response.http_status === 'OK' && response.success) {
            // Success:
            this.toastr.showToastrSuccess('Có thể bắt đầu điểm danh.', 'Thành công!');
            this.getCurrentCourse();
          }
        },
        error => {
          // Error:
          this.toastr.showToastrWarning('', 'Không thành công');
          e.target.checked = false;
        });
    } else if (!blnAllow && currentStatus === 'ONGOING') {
      this.sessionService.closeAttendanceCheck(this.objCourse?.currentSession.id).subscribe(
        response => {
          if (response.http_status === 'OK' && response.success) {
            // Success:
            this.toastr.showToastrWarning('', 'Đã dừng điểm danh!');
            this.getCurrentCourse();
          }
        },
        error => {
          // Error:
          this.toastr.showToastrWarning('', 'Không thành công');
          e.target.checked = true;
        });
    }
  }

  // Check one:
  onChangeAttendance(objStudent, e) {
    const blnAttend: boolean = e.target.checked;
    const objAttend = {
      user_id: objStudent.userProfileResponse.id,
      status: blnAttend ? 'ATTENDANT' : 'ABSENT'
    };
    this.attendService.checkOne(this.objCourse?.currentSession.id, objAttend).subscribe(
      response => {
        if (response.status === 200 && response.body.success) {
          // Success:
          const contentMsg = response.body.content.status === 'ATTENDANT' ? 'Sinh viên có mặt.' : 'Sinh viên vắng mặt.';
          this.toastr.showToastrSuccess(contentMsg, 'Đã điểm danh!', 1000);
          this.getCurrentCourse();
        }
      },
      error => {
        // Error:
        this.toastr.showToastrWarning('', 'Không thành công', 1000);
        e.target.checked = !e.target.checked;
      });

  }

}
