import { Component, OnInit, ViewChild } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from './dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CheckRole } from '../../shared/checkRole';
import * as moment from 'moment';
import { Toastr } from '../../shared/toastr';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public faPlus;
  public imageUrl;
  public strCourseCode = '';
  public lstAllCourse: any[];
  public lstAllCourseCtgr: any[];
  public frmAdd: FormGroup;
  public submitted: boolean;
  public loading: boolean = false;
  public isTeacher: boolean = false;
  public isStudent: boolean = false;
  public currentUser;
  public blnDisableClick = false;
  public minStartDate = this.convertTickToDateDPicker((new Date()).getTime());

  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('joinCourseModal') public joinCourseModal: ModalDirective;

  constructor(private dashBoardService: DashboardService,
              private iconLoading: NgxUiLoaderService,
              private fb: FormBuilder,
              private role: CheckRole,
              private toastr: Toastr
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
    this.isTeacher = this.role.isTeacher();
    this.isStudent = this.role.isStudent();

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
      this.dashBoardService.getTeacherCourse().subscribe(
        response => {
          if (response.body !== null && response.body !== undefined) {
            this.lstAllCourse = response.body.filter(item => item.status === 'ONGOING' || item.status === 'PENDING');
          }
          this.iconLoading.stop();
        },
        error => {
          this.iconLoading.stop();
        });
    } else if (this.currentUser.roles.includes('ROLE_STUDENT')) {
      this.dashBoardService.getStudentCourse().subscribe(
        response => {
          if (response.body !== null && response.body !== undefined) {
            this.lstAllCourse = response.body.filter(item => item.status === 'ONGOING' || item.status === 'PENDING');
          }
          this.iconLoading.stop();
        },
        error => {
          this.iconLoading.stop();
        });
    }
  }

  onClickShowModalAdd() {
    this.resetForm(this.frmAdd);
  }

  onSubmitFormAdd() {
    this.submitted = true;
    this.loading = true;
    this.blnDisableClick = false;

    // Stop here if form is invalid
    if (this.frmAdd.invalid) {
      this.blnDisableClick = false;
      this.loading = false;
      return;
    }
    const name = this.f.inputName.value;
    const description = this.f.inputDes.value;
    const start_date = this.getTicksFromDateString(this.f.inputBeginDate.value);
    const end_date = this.getTicksFromDateString(this.f.inputEndDate.value);
    const course_category_id = this.f.selectCategory.value;
    const objCourse = {course_category_id, name, description, start_date, end_date};

    this.dashBoardService.addCourse(objCourse).subscribe(
      response => {
        if (response.status === 200 && response.body.success) {
          // Success:
          this.addModal.hide();
          this.getLstAllCourse();
          this.toastr.showToastrSuccess(
            'Lớp học mới đã được tạo. Để bắt đầu bạn cần chuyển trạng thái lớp sang hoạt động.', 'Thành công!', 4000);
        }
        this.loading = false;
        this.blnDisableClick = false;
      },
      error => {
        // Error:
        this.loading = false;
        this.blnDisableClick = false;
        this.toastr.showToastrWarning('', 'Không thành công!');
      });
  }

  onClickJoinByCode () {
    this.loading = true;
    this.dashBoardService.joinByCode({ token: this.strCourseCode }).subscribe(
      response => {
        if (response.status === 200 && response.body.success) {
          // Success:
          this.addModal.hide();
          this.getLstAllCourse();
          this.toastr.showToastrSuccess('', 'Bạn đã tham gia lớp học!');
        }
        this.loading = false;
      },
      error => {
        // Error:
        this.loading = false;
        this.toastr.showToastrWarning('Mã sai hoặc bạn chưa công khai thông tin cá nhân!', 'Không thành công!');
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

  resetForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.get(key).setErrors(null) ;
    });
  }




}
