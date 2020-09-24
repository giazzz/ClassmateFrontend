import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
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

}
