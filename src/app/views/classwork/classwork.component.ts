import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

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
      {id: '1', title: 'Test1', createAt: '09:00 28/08/2020'},
      {id: '2', title: 'Test1', createAt: '09:00 28/08/2020'},
      {id: '3', title: 'Test1', createAt: '09:00 28/08/2020'},
      {id: '4', title: 'Test1', createAt: '09:00 28/08/2020'},
      {id: '5', title: 'Test1', createAt: '09:00 28/08/2020'},
    ];
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
