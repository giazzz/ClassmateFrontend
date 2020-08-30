import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classwork',
  templateUrl: './classwork.component.html',
  styleUrls: ['./classwork.component.scss']
})
export class ClassworkComponent implements OnInit {

  public lstClasswork: any[];

  constructor() { }

  ngOnInit(): void {
    this.lstClasswork = [
      {title: 'Test1', createAt: '09:00 28/08/2020'},
      {title: 'Test1', createAt: '09:00 28/08/2020'},
      {title: 'Test1', createAt: '09:00 28/08/2020'},
      {title: 'Test1', createAt: '09:00 28/08/2020'},
      {title: 'Test1', createAt: '09:00 28/08/2020'}
    ];
  }

}
