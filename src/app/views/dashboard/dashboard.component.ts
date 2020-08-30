import { Component, OnInit, ViewChild } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from './dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public faPlus;
  public imageUrl;
  public lstAllCourse: any[];
  public frmAdd: FormGroup;
  public submitted: boolean;

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
    this.getLstAllCourse();

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
    this.dashBoardService.getAllCourse().subscribe(
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
    const startdate = this.getTicksFromDateString(this.f.inputBeginDate.value);
    const enddate = this.getTicksFromDateString(this.f.inputEndDate.value);
    const coursecategoryid = '583a2da9-768e-4724-bbfa-a72bf5038c94';
    const objCourse = {coursecategoryid, name, description, startdate, enddate};

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
