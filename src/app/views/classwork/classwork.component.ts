import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { ClassworkService } from './classwork.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassMateService } from '../classmate.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckRole } from '../../shared/checkRole';
import { Toastr } from '../../shared/toastr';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClassRoomService } from '../class-room/class-room.service';
import { SessionService } from '../class-room/session.service';

@Component({
  selector: 'app-classwork',
  templateUrl: './classwork.component.html',
  styleUrls: ['./classwork.component.scss']
})
export class ClassworkComponent implements OnInit {

  public lstExcercise: any[] = [];
  public courseId;
  public objCourse;
  public isTeacher = false;
  public isStudent = false;
  public frmAdd: FormGroup;
  public frmUpdate: FormGroup;
  public submitted: boolean;
  public loading: boolean = false;
  public minExpiredDate = this.convertTickToDateDPicker((new Date()).getTime());
  public exTitleSelected = '';
  public exIdSelected = '';

  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('updateModal') public updateModal: ModalDirective;
  @ViewChild('addSessionModal') public addSessionModal: ModalDirective;
  @ViewChild('cancelModal') public cancelModal: ModalDirective;

  constructor(private classService: ClassMateService,
              private exService: ClassworkService,
              private router: Router,
              private route: ActivatedRoute,
              private iconLoading: NgxUiLoaderService,
              private toastr: Toastr,
              private fb: FormBuilder,
              public role: CheckRole,
              private classRoomService: ClassRoomService,
              private sessionService: SessionService,
  ) {
  }

  ngOnInit(): void {
    this.iconLoading.start();
    this.isStudent = this.role.isStudent();
    this.isTeacher = this.role.isTeacher();
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId == null || this.courseId === undefined || this.courseId === 'undefined') {
      this.router.navigateByUrl('/dashboard');
    }
    this.getCurrentCourse();
    this.getListExcercise();

    this.frmAdd = this.fb.group({
      inputTitle: ['', [
        Validators.required
      ]],
      textareaContent: ['', [
        Validators.required
      ]],
      inputExpiredDate: ['', [
        Validators.required
      ]]
    });

    this.frmUpdate = this.fb.group({
      inputId: ['', [
      ]],
      inputSessionId: ['', [
      ]],
      inputTitle: ['', [
        Validators.required
      ]],
      textareaContent: ['', [
        Validators.required
      ]],
      inputExpiredDate: ['', [
        Validators.required
      ]]
    });

  }

  get f() { return this.frmAdd.controls; }
  get u() { return this.frmUpdate.controls; }

  getCurrentCourse() {
    this.classService.getClassDetail(this.courseId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objCourse = response.body;
        }
      });
  }


  getListExcercise() {
    this.exService.getListAllExcercise(this.courseId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.lstExcercise = response.body.filter(item => item.status !== 'CANCEL');
        }
        setTimeout(() => {
          this.iconLoading.stop();
        }, 1000);
      },
      error => {
        setTimeout(() => {
          this.iconLoading.stop();
        }, 1000);
      });
  }

  collapse(blnShow: boolean, id: string, e) {
    const item: HTMLElement = e.target;
    if (!item.classList.contains('icon-options-vertical')) {
      $('.div-collapse').addClass('d-none');
      $('.exam').removeClass('is-hover');
      if (blnShow) {
        $('#col-' + id).removeClass('d-none');
        $('#exam-' + id).addClass('is-hover');
      } else {
        $('#col-' + id).addClass('d-none');
      }
    }
  }

  convertTickToDateShort(tick) {
    const date = new Date(Number(tick));
    return moment(date).format('D & M YYYY').replace('&', 'thg') || null;
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
                this.toastr.showToastrSuccess('Bạn đã có thể tạo bài tập mới', 'Thành công!');
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

  onClickShowModalAdd() {
    if (this.objCourse?.currentSession.id == null) {
      this.addSessionModal.show();
      return;
    }
    this.addModal.show();
    this.resetForm(this.frmAdd);
  }

  resetForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.get(key).setErrors(null) ;
    });
  }

  onSubmitFormAdd() {
    this.submitted = true;
    this.loading = true;

    // Stop here if form is invalid
    if (this.frmAdd.invalid) {
      this.loading = false;
      return;
    }
    const objEx = {
      session_id: this.objCourse?.currentSession.id,
      title: this.f.inputTitle.value,
      content: this.f.textareaContent.value,
      answer: '',
      exercise_end_time: this.getTicksFromDateString(this.f.inputExpiredDate.value)
    };

    this.exService.createExcercise(objEx).subscribe(
      response => {
        if (response.status === 200 && response.body.success) {
          // Success:
          this.addModal.hide();
          this.getListExcercise();
          const exId = response.body.content.id;
          this.updateStatusEx(exId, 'ONGOING', 'Đã tạo bài tập.');
        }
        this.loading = false;
      },
      error => {
        // Error:
        this.loading = false;
        this.toastr.showToastrWarning('', 'Không thành công!');
      });
  }

  updateStatusEx(exId, status, msgSuccess) {
    this.exService.updateStatusExcercise(exId, status).subscribe(
      response => {
        if (response.http_status === 'OK' && response.success) {
          // Success:
          this.toastr.showToastrSuccess(msgSuccess, 'Thành công!');
        }
        this.loading = false;
      },
      error => {
        // Error:
        this.loading = false;
      });
  }

  onClickExDetail(exId) {
    this.exService.getDetailExcercise(exId).subscribe(
      response => {
        if (response.status === 200 && response.body != null) {
          // Success:
          this.updateModal.show();
          this.frmUpdate.setValue({
            inputId: response.body.id,
            inputSessionId: response.body.session_id,
            inputTitle: response.body.title,
            textareaContent: response.body.content,
            inputExpiredDate: this.convertTickToDateDPicker(response.body.exercise_end_time)
          });
        }
      });
  }

  onSubmitFormUpdate() {
    this.submitted = true;
    this.loading = true;

    // Stop here if form is invalid
    if (this.frmUpdate.invalid) {
      this.loading = false;
      return;
    }
    const exId = this.u.inputId.value;
    const objEx = {
      session_id: this.u.inputSessionId.value,
      title: this.u.inputTitle.value,
      content: this.u.textareaContent.value,
      answer: '',
      exercise_end_time: this.getTicksFromDateString(this.u.inputExpiredDate.value)
    };

    this.exService.updateExcercise(exId, objEx).subscribe(
      response => {
        if (response.status === 200 && response.body.success) {
          // Success:
          this.updateModal.hide();
          this.getListExcercise();
          this.toastr.showToastrSuccess('Đã sửa thông tin bài tập.', 'Thành công!');
        }
        this.loading = false;
      },
      error => {
        // Error:
        this.loading = false;
        this.toastr.showToastrWarning('', 'Không thành công!');
      });
  }

  onClickCancelEx(exam) {
    this.exTitleSelected = exam.title;
    this.exIdSelected = exam.id;
    this.cancelModal.show();
  }

  onSubmitCancelEx() {
    this.loading = true;
    this.exService.updateStatusExcercise(this.exIdSelected, 'CANCEL').subscribe(
      response => {
        if (response.http_status === 'OK' && response.success) {
          // Success:
          this.toastr.showToastrSuccess('Bài tập đã được hủy.', 'Thành công!');
          this.cancelModal.hide();
          this.getListExcercise();
        }
        this.loading = false;
      },
      error => {
        // Error:
        this.toastr.showToastrWarning('', 'Không thành công!');
        this.loading = false;
      });
  }

  getTicksFromDateString(dateTime: string) {
    const date = new Date(dateTime);
    return date.getTime();
  }

  convertTickToDateDPicker(tick) {
    const date = new Date(Number(tick));
    return moment(date).format('YYYY-MM-DD');
  }
}
