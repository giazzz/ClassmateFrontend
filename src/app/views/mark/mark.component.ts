import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { CheckRole } from '../../shared/checkRole';
import { Router, ActivatedRoute } from '@angular/router';
import { MarkService } from './mark.service';
import * as moment from 'moment';
import { EndpointsConfig } from '../../config/config';
import { Toastr } from '../../shared/toastr';
import { SettingService } from '../setting/setting.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrls: ['./mark.component.scss']
})

export class MarkComponent implements OnInit {

  public objProfile;
  public lstClasswork: any[];
  public lstStudent: any[];
  public isHover: boolean;
  public isClick: boolean;
  public isTeacher: boolean = false;
  public isStudent: boolean = false;
  public loading: boolean = false;
  public currentMark: string;
  public startSlice = 0;
  public endSlice = 0;
  public totalCountEx = 0;
  public courseId;
  public driveUrl = EndpointsConfig.google.driveUrl;
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;
  public currentFile;
  public currentExResult = {
    exercise_title: '',
    student_name: '',
    content: '',
    mark: '',
    result: {
      content: '',
      marked: false,
      mark: '',
      fileResponses: []
    },
  };

  @ViewChild('detailResultExModal') public detailResultExModal: ModalDirective;

  constructor(private role: CheckRole,
              private router: Router,
              private route: ActivatedRoute,
              private markService: MarkService,
              private toastr: Toastr,
              private settingService: SettingService,
              private iconLoading: NgxUiLoaderService,
              public sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {

    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId == null || this.courseId === undefined || this.courseId === 'undefined') {
      this.router.navigateByUrl('/dashboard');
    }
    this.isHover = false;
    this.isClick = false;
    this.isStudent = this.role.isStudent();
    this.isTeacher = this.role.isTeacher();
    this.lstStudent = [];
    this.lstClasswork = [];
    this.startSlice = 0;
    this.iconLoading.start();

    if (this.role.isTeacher()) {
      this.markService.getListStudentOfCourse(this.route.snapshot.paramMap.get('id')).subscribe(
        response => {
          if (response.body != null && response.body !== undefined) {
            // Get list student:
            this.lstStudent = response.body.students.map( item => {
              return {
                id: item.id,
                name: item.fullname,
                avatar: item.avatar_file_id,
                lstExcercise: []
              };
            });
            this.getListExcerciseByTeacher();
          }
          setTimeout(() => {
            this.iconLoading.stop();
          }, 4000);
        },
        error => {
          setTimeout(() => {
            this.iconLoading.stop();
          }, 4000);
        });
    }

    if (this.role.isStudent()) {
      this.settingService.getProfile(JSON.parse(localStorage.currentUser).id || '').subscribe(
        response => {
          if (response.body != null && response.body !== undefined) {
            this.objProfile = response.body;
            this.lstStudent = [];
            this.lstStudent.push({
              id: this.objProfile?.id,
              name: this.objProfile?.fullname,
              avatar: this.objProfile?.avatar_file_id,
              lstExcercise: []
            });
            this.getListExcerciseByStudent();
          }
        });
    }

  }

  getListExcerciseByTeacher() {
    this.markService.getListAllExcercise(this.route.snapshot.paramMap.get('id')).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.getListExFromListAll(response.body);
          this.endSlice = response.body.length > 4 ? 4 : response.body.length;
          this.totalCountEx = response.body.length;
        }
      });
  }

  getListExcerciseByStudent() {
    this.markService.getListStudentExcercise(this.route.snapshot.paramMap.get('id')).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.getListExFromListAll(response.body);
          this.endSlice = response.body.length > 4 ? 4 : response.body.length;
          this.totalCountEx = response.body.length;
        }
        setTimeout(() => {
          this.iconLoading.stop();
        }, 2000);
      },
      error => {
        setTimeout(() => {
          this.iconLoading.stop();
        }, 2000);
      });
  }

  getListExFromListAll(lstAll) {
    // Get list all excercise:
    this.lstClasswork = lstAll.map( item => {
      return {
        exercise_id: item.id,
        title: item.title,
        createAt: this.convertTickToDate(item.created_at),
        created_at: item.created_at,
        doneCount: item.gradeRecordResponses.filter(s => s.studentExerciseResponse.submitted).length,
        allCount: item.gradeRecordResponses.length
      };
    });
    // Get list excercise by student:
    lstAll.forEach(item => {
      for (const s of this.lstStudent) {
        let isHaveEx = false;
        for (const ex of item.gradeRecordResponses) {
          if (ex.userProfileResponse.id === s.id ) {
            isHaveEx = true;
            s.lstExcercise.push(
              {
                exercise_id: item.id,
                exercise_content: item.content,
                exercise_title: item.title,
                student_name: s.name,
                created_at: item.created_at,
                exercise_student_id: ex.studentExerciseResponse.id,
                submitted: ex.studentExerciseResponse.submitted,
                mark: ex.studentExerciseResponse.marked ? ex.studentExerciseResponse.mark.toFixed(1) : null,
                marked: ex.studentExerciseResponse.marked,
                teacher_message: ex.studentExerciseResponse.teacher_message,
                isAssign: true
              });
          }
        }
        if (!isHaveEx) {
          s.lstExcercise.push(
            {
              exercise_id: item.id,
              exercise_content: null,
              exercise_title: null,
              student_name: null,
              created_at: null,
              exercise_student_id: null,
              submitted: null,
              mark: null,
              marked: false,
              teacher_message: null,
              isAssign: false
            });
        }

      }
    });
  }

  onTdScoreClick(exItem,  index: number, indexChild: number, e) {
    this.lstStudent.forEach( ele => {
      ele.lstExcercise.forEach(ex => {
        if (ex === exItem) {
          ex.isClick = true;
        } else {
          ex.isClick = false;
        }
      });
    });
    const item: HTMLElement = e.target;
    if (item.classList.contains('div-score') || item.classList.contains('j4')) {
      const id = index.toString() + indexChild.toString();
      $('#input-' + id).trigger('focus');
    }
  }

  convertTickToDate(tick: string) {
    const date = new Date(Number(tick));
    return moment(date).format('DD/MM/YYYY');
  }

  sortListExercise(lstEx) {
    return lstEx.sort((val1, val2) => {
      return Number(val2.created_at) - Number(val1.created_at) || val2.exercise_id - val1.exercise_id;
    });
  }

  onFocusInputMark(mark) {
    this.currentMark = mark;
  }

  onSubmitMark(ex) {
    if (ex.mark == null || ex.mark === this.currentMark || ex.mark < 0 || ex.mark > 10) {
      ex.mark = this.currentMark;
      return;
    }
    this.loading = true;
    this.markService.markStudentExercise(ex.exercise_student_id, {mark: ex.mark, teacher_message: 'Done'}).subscribe(
      response => {
        if (response.body != null && response.body !== undefined && response.body.success) {
          ex.mark = response.body.content.mark.toFixed(1);
          ex.marked = true;
          ex.isClick = false;
          ex.isFocus = false;
          this.getAverageMarkByIdEx(ex.exercise_id);
          this.toastr.showToastrSuccess('Thêm điểm thành công', 'Thành công');
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        ex.mark = this.currentMark;
      });
  }

  onClickEditMark( index: number, indexChild: number) {
    const id = index.toString() + indexChild.toString();
    $('#input-' + id).trigger('focus');
  }

  onClickShowModalDetailEx(ex) {
    this.detailResultExModal.show();
    const id = ex.exercise_student_id;
    this.markService.getDetailResultEx(id).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          ex.result = response.body;
          this.currentExResult = ex;
        }
      });
  }

  getAverageMarkByIdEx(exercise_id) {
    let total = 0;
    let count = 0;
    this.lstStudent.forEach( s => {
      total += Number(s.lstExcercise.find( ex => ex.exercise_id === exercise_id)?.mark);
      count += s.lstExcercise.find( ex => ex.exercise_id === exercise_id && ex?.marked) == null ? 0 : 1;
    });
    return count === 0 ? null : (total / count).toFixed(1);
  }

  onClickPrevPage() {
    if (this.startSlice === 0) {
      return;
    }
    this.startSlice = this.startSlice - 1;
    this.endSlice = this.endSlice - 1;
  }

  onClickNextPage() {
    if (this.endSlice === this.totalCountEx) {
      return;
    }
    this.startSlice = this.startSlice + 1;
    this.endSlice = this.endSlice + 1;
  }

  onClickReadFile(file) {
    this.currentFile = {
      name: file.name,
      url: this.sanitizer.bypassSecurityTrustResourceUrl('https://drive.google.com/file/d/' + file.file_id + '/preview?hl=en&pid=explorer&efh=false&a=v&chrome=false&embedded=true')
    };
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}
