import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-class-room',
  templateUrl: './class-room.component.html',
  styleUrls: ['./class-room.component.scss']
})
export class ClassRoomComponent implements OnInit {

  public classId;

  constructor(private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('id');
  }

}
