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

    this.markService.getListAllExcercise(this.route.snapshot.paramMap.get('id')).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.lstExcercise = response.body;

          this.lstClasswork = response.body.map( item => {
            return {
              id: item.id,
              title: item.title,
              createAt: this.convertTickToDate(item.created_at)
            };
          });

          this.lstStudent = response.body.map( item => {
            return {
              id: item.id,
              title: item.title,
              createAt: this.convertTickToDate(item.created_at)
            };
          });
          debugger
        }
      });

    this.lstClasswork = [
      {id: '1', title: 'Test1', createAt: '09:00 28/08/2020'},
      {id: '2', title: 'Test2', createAt: '09:00 28/08/2020'},
      {id: '3', title: 'Test3', createAt: '09:00 28/08/2020'},
      {id: '4', title: 'Test4', createAt: '09:00 28/08/2020'},
      {id: '5', title: 'Test5', createAt: '09:00 28/08/2020'},
    ];

    this.lstStudent = [
      {
        id: '1',
        name: 'Trần Văn Nguyên',
        lstScore: [
          {id: '1', title: 'Test1', score: 6},
          {id: '2', title: 'Test2', score: 7},
          {id: '3', title: 'Test3', score: null},
          {id: '4', title: 'Test4', score: 9},
          {id: '5', title: 'Test5', score: 10},
        ]
      },
      {
        id: '1',
        name: 'Trần Văn Nguyên',
        lstScore: [
          {id: '1', title: 'Test1', score: 6},
          {id: '2', title: 'Test2', score: null},
          {id: '3', title: 'Test3', score: 8},
          {id: '4', title: 'Test4', score: 9},
          {id: '5', title: 'Test5', score: 10},
        ]
      },
      {
        id: '1',
        name: 'Trần Văn Nguyên',
        lstScore: [
          {id: '1', title: 'Test1', score: 6},
          {id: '2', title: 'Test2', score: 7},
          {id: '3', title: 'Test3', score: null},
          {id: '4', title: 'Test4', score: null},
          {id: '5', title: 'Test5', score: 10},
        ]
      },
    ];

  }

  onTdScoreClick(index: number, indexChild: number, e) {
    const item: HTMLElement = e.target;
    if (item.classList.contains('div-score') || item.classList.contains('j4')) {
      const id = index.toString() + indexChild.toString();
      $('#input-' + id).focus();
    }
  }

  convertTickToDate(tick: string) {
    const date = new Date(Number(tick));
    return moment(date).format('DD/MM/YYYY');
  }

}
