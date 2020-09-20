import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ClassworkService } from './classwork.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassMateService } from '../classmate.service';

@Component({
  selector: 'app-classwork',
  templateUrl: './classwork.component.html',
  styleUrls: ['./classwork.component.scss']
})
export class ClassworkComponent implements OnInit {

  public lstExcercise: any[] = [];
  public courseId;
  public objCourse;

  constructor(private classService: ClassMateService,
              private exService: ClassworkService,
              private router: Router,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId == null || this.courseId === undefined || this.courseId === 'undefined') {
      this.router.navigateByUrl('/dashboard');
    }
    this.getCurrentCourse();
    this.getListExcercise();

  }

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
          this.lstExcercise = response.body;
        }
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

}
