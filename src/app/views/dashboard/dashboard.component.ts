import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public imageUrl;
  public faPlus;

  constructor() {}

  ngOnInit(): void {
    this.faPlus = faPlus;
    this.imageUrl = 'https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png';
  }
}
