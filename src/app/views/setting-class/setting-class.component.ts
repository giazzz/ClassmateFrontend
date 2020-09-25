import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EndpointsConfig } from '../../config/config';
import { CheckRole } from '../../shared/checkRole';
import { Toastr } from '../../shared/toastr';
import { ClassRoomService } from '../class-room/class-room.service';
import { SessionService } from '../class-room/session.service';
import { ClassMateService } from '../classmate.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { SettingClassService } from './setting-class.service';

@Component({
  selector: 'app-setting-class',
  templateUrl: './setting-class.component.html',
  styleUrls: ['./setting-class.component.scss']
})
export class SettingClassComponent implements OnInit {

  public classId;
  public objClass;
  public strCode = null;
  public isTeacher: boolean = false;
  public loading: boolean = false;
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;
  public driveUrl = EndpointsConfig.google.driveUrl;

  @ViewChild('endSessionModal') public endSessionModal: ModalDirective;
  @ViewChild('addTimeModal') public addTimeModal: ModalDirective;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private classService: ClassMateService,
              private classRoomService: ClassRoomService,
              public sanitizer: DomSanitizer,
              public role: CheckRole,
              private iconLoading: NgxUiLoaderService,
              private fb: FormBuilder,
              private settingService: SettingClassService,
              private sessionService: SessionService,
              private toastr: Toastr,
  ) {
  }

  ngOnInit(): void {
    this.iconLoading.start();
    this.classId = this.route.snapshot.paramMap.get('id');
    if (this.classId == null || this.classId === undefined || this.classId === 'undefined') {
      this.router.navigateByUrl('/dashboard');
    }
    const now = (new Date()).getTime();
    const strExpired = sessionStorage[this.classId] || null;
    if (strExpired != null && Number(strExpired) > now ) {
      this.strCode = sessionStorage['code' + this.classId] || null;
    }
    // Get class detail:
    this.getCurrentCourse();
  }

  getCurrentCourse() {
    this.classService.getClassDetail(this.classId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objClass = response.body;
        }
      });
  }

  onClickCreateCode() {
    this.loading = true;
    this.settingService.generateCourseToken(this.classId).subscribe(
      response => {
        if (response.http_status === 'OK' && response.success) {
          this.strCode = response.token;
          const expired = new Date();
          expired.setDate(expired.getDate() + 1);
          sessionStorage.setItem(this.classId, expired.getTime().toString());
          sessionStorage.setItem('code' + this.classId, response.token);
          this.toastr.showToastrSuccess('', 'Tạo mã thành công!');
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.toastr.showToastrWarning('', 'Không thành công!');
      });
  }

  onChangeAddSession(e) {
    if (!e.target.checked) {
      return;
    }
    const now = new Date();
    const objSession = {
      course_id: this.objClass.id,
      name: 'Buổi học ' + moment(now).format('DD/MM/YYYY'),
      content: this.objClass.name,
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
              }
            },
            error => {
              // Error:
              this.toastr.showToastrWarning('', 'Không thành công');
            });
        }
      },
      error => {
        // Error:
        this.toastr.showToastrWarning('', 'Không thành công');
        e.target.checked = false;
      });
  }

  // onClickAddTimeSession() {
  //   this.loading = true;
  //   const id = this.objClass?.currentSession.id;
  //   const objSession = {

  //   }
  //   this.settingService.updateSession(id, objSession).subscribe(
  //     response => {
  //       if (response.http_status === 'OK' && response.success) {
  //         this.addTimeModal.hide();
  //         this.getCurrentCourse();
  //         this.toastr.showToastrSuccess('', 'Thành công!');
  //       }
  //       this.loading = false;
  //     },
  //     error => {
  //       this.loading = false;
  //       this.toastr.showToastrWarning('', 'Không thành công!');
  //     });
  // }

  onClickEndSession() {
    this.loading = true;
    this.settingService.endSession(this.objClass?.currentSession.id).subscribe(
      response => {
        if (response.http_status === 'OK' && response.success) {
          this.endSessionModal.hide();
          this.getCurrentCourse();
          this.toastr.showToastrSuccess('', 'Buổi học đã kết thúc!');
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.toastr.showToastrWarning('', 'Không thành công!');
      });
  }

  convertTickToDateShort(tick) {
    const date = new Date(Number(tick));
    return moment(date).format('D & M YYYY hh:mm').replace('&', 'thg');
  }

  getEndTime(startTick, duration) {
    const date = new Date(Number(startTick));
    date.setHours(date.getHours() + Number(duration));
    return moment(date).format('D & M YYYY hh:mm').replace('&', 'thg');
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
