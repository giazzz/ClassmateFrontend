import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-class-room',
  templateUrl: './class-room.component.html',
  styleUrls: ['./class-room.component.scss']
})
export class ClassRoomComponent implements OnInit {
  public classId;
  public imgUrl: string;
  public objClass;

  constructor(private route: ActivatedRoute,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('id');
    if (this.classId == null || this.classId === undefined || this.classId === 'undefined') {
      this.router.navigateByUrl('/dashboard');
    }

    const imageName = localStorage.classBg || '1.jpg';
    this.imgUrl = 'assets/img/classBg/' + imageName;
    this.objClass = {
      className: 'T1807E',
      classCategory: 'IT',
      classCode: '112'
    }

  }

}
