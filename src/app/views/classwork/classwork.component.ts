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
import { DomSanitizer } from '@angular/platform-browser';
import { EndpointsConfig } from '../../config/config';

@Component({
  selector: 'app-classwork',
  templateUrl: './classwork.component.html',
  styleUrls: ['./classwork.component.scss']
})
export class ClassworkComponent implements OnInit {

  public lstExcercise: any[] = [];
  public lstExResultStudent: any[] = [];
  public courseId;
  public objCourse;
  public isTeacher = false;
  public isStudent = false;
  public frmAdd: FormGroup;
  public frmUpdate: FormGroup;
  public frmPostExercise: FormGroup;
  public submitted: boolean;
  public loading: boolean = false;
  public minExpiredDate = this.convertTickToDateDPicker((new Date()).getTime());
  public exTitleSelected = '';
  public exIdSelected = '';
  public currentEx;
  public resultExSelected = {
    content: '',
    fileResponses: []
  };
  public lstSelectedFile = [];
  public currentFile;
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;
  public driveUrl = EndpointsConfig.google.driveUrl;

  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('updateModal') public updateModal: ModalDirective;
  @ViewChild('addSessionModal') public addSessionModal: ModalDirective;
  @ViewChild('cancelModal') public cancelModal: ModalDirective;
  @ViewChild('detailModal') public detailModal: ModalDirective;
  @ViewChild('postExModal') public postExModal: ModalDirective;
  @ViewChild('readFileModal') public readFileModal: ModalDirective;
  @ViewChild('unSubmitModal') public unSubmitModal: ModalDirective;
  @ViewChild('detailResultExModal') public detailResultExModal: ModalDirective;

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
              public sanitizer: DomSanitizer,
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
    this.frmPostExercise = this.fb.group({
      textareaContent: ['', [
        Validators.required,
        Validators.maxLength(2000),
      ]]
    });

  }

  get f() { return this.frmAdd.controls; }
  get u() { return this.frmUpdate.controls; }
  get frmPostEx() { return this.frmPostExercise.controls; }

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
          if (this.isStudent) {
            this.exService.getListStudentExByCourse(this.courseId).subscribe(
              data => {
                if (data.body != null && data.body !== undefined) {
                  this.lstExcercise.forEach(ex => {
                    ex.result = data.body.find(rs => rs.exercise_id === ex.id);
                  });
                }
              });
          }
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

  convertTickToDateLong(tick) {
    const date = new Date(Number(tick));
    return moment(date).format('D & M YYYY hh:mm').replace('&', 'thg') || null;
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

  onclickShowDetailEx(ex) {
    this.currentEx = ex;
    this.detailModal.show();
  }

  onClickPostEx(ex) {
    this.currentEx = ex;
    this.postExModal.show();
    this.resetForm(this.frmPostExercise);
    this.lstSelectedFile = [];
  }

  async onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.lstSelectedFile.push(
          {
            file: event.target.files[i],
            url: await this.getBase64(event.target.files[i])
          });
      }
    }
  }

  // Nộp bài tập:
  onSubmitFormPostEx() {
    this.submitted = true;
    this.loading = true;

    // Stop here if form is invalid
    if (this.frmPostExercise.invalid) {
      this.loading = false;
      return;
    }

    // Upload files:
    const lstFileUpload = this.lstSelectedFile.map(item => {
      return item.file;
    });
    this.classRoomService.uploadFile(lstFileUpload).subscribe(
      response => {
        if (response.body != null && response.body !== undefined && response.body.length > 0) {
          const lstFile = [];
          response.body.forEach(item => {
            lstFile.push(
              {
                name: item.file_name,
                description: item.file_name,
                file_id: item.file_id,
                file_size: item.file_size
              });
          });

          // Post ex:
          const objEx = {
            content: this.frmPostEx.textareaContent.value,
            student_message: 'done',
            fileRequests: lstFile
          };
          this.exService.postExcercise(this.currentEx.id, objEx).subscribe(
            data => {
              if (data.body != null && data.body !== undefined) {
                this.toastr.showToastrSuccess('Bài tập đã được nộp', 'Thành công!');
                this.postExModal.hide();
                this.getListExcercise();
                this.lstSelectedFile = [];
                this.loading = false;
              }
            },
            error => {
              this.toastr.showToastrWarning('', 'Không thành công!');
              this.lstSelectedFile = [];
              this.loading = false;
            });
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }

  onClickShowModalUnsubmit(exam) {
    this.exTitleSelected = exam.title;
    this.exIdSelected = exam.id;
    this.unSubmitModal.show();
  }

  onSubmitUnSubmitEx() {
    this.loading = true;
    this.exService.unSubmit(this.exIdSelected).subscribe(
      response => {
        if (response.http_status === 'OK' && response.success) {
          // Success:
          this.toastr.showToastrSuccess('Bài nộp đã được hủy.', 'Thành công!');
          this.unSubmitModal.hide();
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

  onclickShowModalResultEx(exam) {
    this.resultExSelected = exam.result;
    this.exTitleSelected = exam.title;
    this.detailResultExModal.show();
  }

  getTicksFromDateString(dateTime: string) {
    const date = new Date(dateTime);
    return date.getTime();
  }

  convertTickToDateDPicker(tick) {
    const date = new Date(Number(tick));
    return moment(date).format('YYYY-MM-DD');
  }

  resetForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.get(key).setErrors(null) ;
    });
  }

  onClickReadFile(file) {
    this.currentFile = {
      name: file.name,
      url: this.sanitizer.bypassSecurityTrustResourceUrl('https://drive.google.com/file/d/' + file.file_id + '/preview?hl=en&pid=explorer&efh=false&a=v&chrome=false&embedded=true')
    };
  }

  onClickReadFilePreview(file) {
    this.currentFile = {
      name: file.file.name,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(file.url)
    };
    const type = this.getTypeFile(file.file.name)
    if (type === 'Word' || type === 'Excel') {
      return;
    }
    this.readFileModal.show();
  }

  getTypeFile(strUrl: string) {
    if (strUrl != null && strUrl !== undefined && strUrl !== '') {
      const extension = strUrl.split('.').pop();
      if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'psd', 'svg'].includes(extension)) {
        return 'Hình ảnh';
      } else if (['doc', 'docx'].includes(extension)) {
        return 'Word';
      } else if (['xls', 'xlsx'].includes(extension)) {
        return 'Excel';
      } else if (['pdf'].includes(extension)) {
        return 'PDF';
      } else if (['txt'].includes(extension)) {
        return 'Text';
      }
    }
    return '';
  }

  getPreviewImgByFileType(strUrl: string, fileId: string, blnIsPreview = false) {
    if (strUrl != null && strUrl !== undefined && strUrl !== '') {
      const extension = strUrl.split('.').pop();
      if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'psd', 'svg'].includes(extension)) {
        return !blnIsPreview ? this.driveUrl + fileId : fileId;
      } else if (['doc', 'docx'].includes(extension)) {
        return 'assets/img/word-file-icon.jpg';
      } else if (['xls', 'xlsx'].includes(extension)) {
        return 'assets/img/excel-icon.png';
      } else if (['pdf'].includes(extension)) {
        return 'assets/img/pdf-file-icon-svg.png';
      }
      return 'assets/img/document.png';
    }
    return 'assets/img/document.png';
  }

  onClickRemoveSelectedFile(item, blnDeleteFileUploaded = false) {
    if (!blnDeleteFileUploaded) {
      const index = this.lstSelectedFile.indexOf(item);
      this.lstSelectedFile.splice(index, 1);
    } else {
      // const index = this.currentPost.attachmentResponses.indexOf(item);
      // this.currentPost.attachmentResponses.splice(index, 1);
    }
  }

  // Convert file to base64data:
  getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}
