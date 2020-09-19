import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CheckRole } from '../../shared/checkRole';
import { Router, ActivatedRoute } from '@angular/router';
import { MarkService } from './mark.service';
import * as moment from 'moment';
import { EndpointsConfig } from '../../config/config';
import { Toastr } from '../../shared/toastr';
import { SettingService } from '../setting/setting.service';

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
  public currentMark: string;

  public courseId;
  public driveUrl = EndpointsConfig.google.driveUrl;
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;

  constructor(private role: CheckRole,
              private router: Router,
              private route: ActivatedRoute,
              private markService: MarkService,
              private toastr: Toastr,
              private settingService: SettingService
  ) {
  }

  ngOnInit(): void {
    this.settingService.getProfile(JSON.parse(localStorage.currentUser).id || '').subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objProfile = response.body;
        }
      });

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

    if (this.isTeacher) {
      this.markService.getListStudentOfCourse(this.route.snapshot.paramMap.get('id')).subscribe(
        response => {
          if (response.body != null && response.body !== undefined) {
            // Get list student:
            this.lstStudent = response.body.students.map( item => {
              return {
                id: item.id,
                name: item.username,
                avatar: item.avatar_file_id,
                lstExcercise: []
              };
            });
            this.getListExcerciseByTeacher();
          }
        });
    }

    if (this.isStudent) {
      this.lstStudent = [];
      this.lstStudent.push({
        id: this.objProfile?.id,
        name: this.objProfile?.username,
        avatar: this.objProfile?.avatar_file_id,
        lstExcercise: []
      });
      this.getListExcerciseByStudent();
    }


  }

  getListExcerciseByTeacher() {
    this.markService.getListAllExcercise(this.route.snapshot.paramMap.get('id')).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.getListExFromListAll(response.body);
        }
      });
  }

  getListExcerciseByStudent() {
    this.markService.getListStudentExcercise(this.route.snapshot.paramMap.get('id')).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.getListExFromListAll(response.body);
        }
      });
  }

  getListExFromListAll( lstAll) {
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
      item.gradeRecordResponses.forEach(ex => {
        this.lstStudent.find(s => s.id === ex.userProfileResponse.id).lstExcercise.push(
          {
            exercise_id: item.id,
            created_at: item.created_at,
            exercise_student_id: ex.studentExerciseResponse.id,
            submitted: ex.studentExerciseResponse.submitted,
            mark: ex.studentExerciseResponse.marked ? ex.studentExerciseResponse.mark.toFixed(1) : null,
            marked: ex.studentExerciseResponse.marked,
            teacher_message: ex.studentExerciseResponse.teacher_message,
          }
        );
      });
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
    this.markService.markStudentExercise(ex.exercise_student_id, {mark: ex.mark, teacher_message: 'Done'}).subscribe(
      response => {
        if (response.body != null && response.body !== undefined && response.body.success) {
          ex.mark = response.body.content.mark.toFixed(1);
          ex.marked = true;
          ex.isClick = false;
          ex.isFocus = false;
          this.toastr.showToastrSuccess('Thêm điểm thành công', 'Thành công');
        }
      },
      error => {
        ex.mark = this.currentMark;
      });
  }

  onClickEditMark( index: number, indexChild: number) {
    const id = index.toString() + indexChild.toString();
    $('#input-' + id).trigger('focus');
  }

  onClickShowEx(exId) {
    console.log(exId);
  }

}
