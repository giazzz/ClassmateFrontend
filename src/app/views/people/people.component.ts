import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  public blnNotConfirm: boolean;

  constructor() { }

  ngOnInit(): void {
    this.blnNotConfirm = true;
  }

}
