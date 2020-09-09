import { Component, OnInit, ViewChild } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from './dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public faPlus;
  public imageUrl;
  public lstAllCourse: any[];
  public lstAllCourseCtgr: any[];
  public frmAdd: FormGroup;
  public submitted: boolean;
  public currentUser;

  @ViewChild('addModal') public addModal: ModalDirective;

  constructor (private dashBoardService: DashboardService,
              private iconLoading: NgxUiLoaderService,
              private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.iconLoading.start();
    this.imageUrl = 'https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png';
    this.submitted = false;
    this.faPlus = faPlus;
    this.lstAllCourse = [];
    this.lstAllCourseCtgr = [];
    this.currentUser = JSON.parse(localStorage.currentUser);

    this.getLstAllCourse();

    this.dashBoardService.getAllCourseCategory().subscribe(
      response => {
        if (response.body !== null && response.body !== undefined) {
          this.lstAllCourseCtgr = response.body;
        }
      });

    this.frmAdd = this.fb.group({
      inputName: ['', [
        Validators.required
      ]],
      inputDes: ['', [
        Validators.required
      ]],
      selectCategory: ['', [
        Validators.required
      ]],
      inputBeginDate: ['', [
        Validators.required
      ]],
      inputEndDate: ['', [
        Validators.required
      ]]
    });
  }

  get f() { return this.frmAdd.controls; }

  getLstAllCourse() {
    const date = new Date();
    if (this.currentUser.roles.includes('ROLE_TEACHER')) {
      this.dashBoardService.getTeacherCourse(date.getTime()).subscribe(
        response => {
          if (response.body !== null && response.body !== undefined) {
            this.lstAllCourse = response.body;
          }
          this.iconLoading.stop();
        },
        error => {
          this.iconLoading.stop();
        });
    } else if (this.currentUser.roles.includes('ROLE_STUDENT')) {
      this.dashBoardService.getStudentCourse(this.currentUser.id, date.getTime()).subscribe(
        response => {
          if (response.body !== null && response.body !== undefined) {
            this.lstAllCourse = response.body;
          }
          this.iconLoading.stop();
        },
        error => {
          this.iconLoading.stop();
        });
    }
  }

  onSubmitFormAdd() {
    this.submitted = true;
    this.iconLoading.start();

    // Stop here if form is invalid
    if (this.frmAdd.invalid) {
      this.iconLoading.stop();
      return;
    }
    const name = this.f.inputName.value;
    const description = this.f.inputDes.value;
    const start_date = this.getTicksFromDateString(this.f.inputBeginDate.value);
    const end_date = this.getTicksFromDateString(this.f.inputEndDate.value);
    const course_category_id = this.f.selectCategory.value;
    const objCourse = {course_category_id, name, description, start_date, end_date};

    this.dashBoardService.addCourse(objCourse)
      .subscribe(
        response => {
          const successMsg = 'save course success';
          if (response.status === 200 && response.body === successMsg) {
            // Success:
            this.addModal.hide();
            this.getLstAllCourse();
          }
          this.iconLoading.stop();
        },
        error => {
          // Error:
          this.iconLoading.stop();
        });
  }

  getTicksFromDateString(dateTime: string) {
    const date = new Date(dateTime);
    return date.getTime();
  }

}
