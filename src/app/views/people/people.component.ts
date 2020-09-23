import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EndpointsConfig } from '../../config/config';
import { CheckRole } from '../../shared/checkRole';
import { Toastr } from '../../shared/toastr';
import { PeopleService } from './people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  public blnNotConfirm: boolean;
  public objProfilesCourse;
  public courseId;
  public objCourse;
  public objTeacher;
  public lstStudents = [];
  public isTeacher: boolean = false;
  public isStudent: boolean = false;
  public blnCheckAll: boolean = false;
  public loading: boolean = false;
  public driveUrl = EndpointsConfig.google.driveUrl;
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;

  @ViewChild('addStudentModal') public addStudentModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;

  constructor(private role: CheckRole,
              private router: Router,
              private route: ActivatedRoute,
              private toastr: Toastr,
              private peopleService: PeopleService,
              private iconLoading: NgxUiLoaderService,
  ) {
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId == null || this.courseId === undefined || this.courseId === 'undefined') {
      this.router.navigateByUrl('/dashboard');
    }
    this.blnNotConfirm = true;
    this.isStudent = this.role.isStudent();
    this.isTeacher = this.role.isTeacher();
    this.iconLoading.start();
    if (this.isTeacher) {
      this.getAllProfilesCourseByTeacher();

    }
  }

  getAllProfilesCourseByTeacher() {
    this.peopleService.allProfileInCourse(this.courseId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objProfilesCourse = response.body;
          this.objCourse = response.body.courseResponse;
          this.objTeacher = response.body.teacher;
          this.lstStudents = response.body.students;
        }
        setTimeout(() => {
          this.iconLoading.stop();
        }, 500);
      },
      error => {
        setTimeout(() => {
          this.iconLoading.stop();
        }, 500);
      });
  }

  onChangeCheckAll() {
    this.lstStudents.forEach(item => {
      item.check = this.blnCheckAll;
    });
  }

  onClickRemoveStudent() {
    const lstStudentSelected = this.lstStudents.filter(item => item.check);
    let countSuccess = 0;
    lstStudentSelected.forEach(item => {
      const course_id = this.courseId;
      const student_id = item.id;
      this.peopleService.removeFromCourse({ course_id, student_id }).subscribe(
        response => {
          if (response.body != null && response.body.success) {
            countSuccess++;
            this.getAllProfilesCourseByTeacher();
            if (countSuccess === lstStudentSelected.length) {
              this.toastr.showToastrSuccess(`Đã xóa ${countSuccess} sinh viên khỏi lớp.`, 'Thành công!');
            }
          }
        });
    });
    this.deleteModal.hide();
  }

}
