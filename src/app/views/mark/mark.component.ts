import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrls: ['./mark.component.scss']
})
export class MarkComponent implements OnInit {

  public lstClasswork: any[];
  public lstStudent: any[];

  constructor() { }

  ngOnInit(): void {
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
          {id: '3', title: 'Test3', score: 8},
          {id: '4', title: 'Test4', score: 9},
          {id: '5', title: 'Test5', score: 10},
        ]
      },
    ];
  }

}
