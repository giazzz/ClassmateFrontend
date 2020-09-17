import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CheckRole } from '../../shared/checkRole';
import { Router, ActivatedRoute } from '@angular/router';
import { MarkService } from './mark.service';
import * as moment from 'moment';

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrls: ['./mark.component.scss']
})

export class MarkComponent implements OnInit {

  public lstClasswork: any[];
  public lstStudent: any[];
  public isHover: boolean;
  public isClick: boolean;
  public isTeacher: boolean = false;
  public isStudent: boolean = false;
  public lstExcercise: any[];
  public courseId;

  constructor(private role: CheckRole,
              private router: Router,
              private route: ActivatedRoute,
              private markService: MarkService
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
    this.lstExcercise = [];
    this.markService.getListStudentOfCourse(this.route.snapshot.paramMap.get('id')).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          // Get list student:
          this.lstStudent = response.body.students.map( item => {
            return {
              id: item.id,
              name: item.username,
              avatar: item.avatar_uri,
              lstExcercise: []
            };
          });

          this.getListExcercise();

        }
      });

    // this.lstClasswork = [
    //   {id: '1', title: 'Test1', createAt: '09:00 28/08/2020'},
    //   {id: '2', title: 'Test2', createAt: '09:00 28/08/2020'},
    //   {id: '3', title: 'Test3', createAt: '09:00 28/08/2020'},
    //   {id: '4', title: 'Test4', createAt: '09:00 28/08/2020'},
    //   {id: '5', title: 'Test5', createAt: '09:00 28/08/2020'},
    // ];

    // this.lstStudent = [
    //   {
    //     id: 'b0ceb98e-c5de-40c4-8f92-4e4a5dee2be3',
    //     name: 'senbonzakura1997Student4',
    //     avatar: 'https://res.cloudinary.com/senbonzakura/image/upload/v1573316200/avatar_tpygpm.jpg',
    //     lstExcercise: [
    //       {exerciseId: '59f05917-7cdb-4b1d-865f-a164e2b1065a', id: '1', title: 'Test1', score: 6, exercisePosted: false},
    //       {exerciseId: '9973871d-b50a-4d97-9bfd-071c77e7bea4', id: '1', title: 'Test1', score: 6, exercisePosted: false}
    //     ]
    //   },
    //   {
    //     id: 'b0ceb98e-c5de-40c4-8f92-4e4a5dee2be3',
    //     name: 'senbonzakura1997Student4',
    //     avatar: 'https://res.cloudinary.com/senbonzakura/image/upload/v1573316200/avatar_tpygpm.jpg',
    //     lstExcercise: [
    //       {exerciseId: '59f05917-7cdb-4b1d-865f-a164e2b1065a', id: '1', title: 'Test1', score: 6, exercisePosted: false},
    //       {exerciseId: '9973871d-b50a-4d97-9bfd-071c77e7bea4', id: '1', title: 'Test1', score: 6, exercisePosted: false}
    //     ]
    //   }
    // ];

  }

  getListExcercise() {
    this.markService.getListAllExcercise(this.route.snapshot.paramMap.get('id')).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.lstExcercise = response.body;
          // Get list all excercise:
          this.lstClasswork = response.body.map( item => {
            return {
              id: item.id,
              title: item.title,
              createAt: this.convertTickToDate(item.created_at),
              doneCount: item.gradeRecordResponses.filter(s => s.exercisePosted === true).length,
              allCount: item.gradeRecordResponses.length
            };
          });
          // Get list excercise by student:
          response.body.forEach(item => {
            item.gradeRecordResponses.forEach(ex => {
              this.lstStudent.find(s => s.id === ex.userProfileResponse.id).lstExcercise.push(
                { exerciseId: item.id, id: '1', title: 'Test1', score: 6, exercisePosted: ex.exercisePosted }
              );
            });
          });

        }
      });
  }

  onTdScoreClick(index: number, indexChild: number, e) {
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

}
