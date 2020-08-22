import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public imageUrl;
  ngOnInit(): void {
    this.imageUrl = 'https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png';
  }
}
