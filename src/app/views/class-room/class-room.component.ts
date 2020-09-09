import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassMateService } from '../classmate.service';
import * as $ from 'jquery';
import { EndpointsConfig } from '../../config/config';
import { ClassRoomService } from './class-room.service';

@Component({
  selector: 'app-class-room',
  templateUrl: './class-room.component.html',
  styleUrls: ['./class-room.component.scss']
})
export class ClassRoomComponent implements OnInit {
  public classId;
  public imgUrl: string;
  public idImageBgClass: number;
  public objClass;
  public objLoggedUser;
  public blnIsClick: boolean = false;
  public lstClassWork: any[] = [];
  public lstCmt: any[] = [];
  public lstClassBgImg: any[] = [];
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private classService: ClassMateService,
              private classRoomService: ClassRoomService,
  ) {
  }

  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('id');
    if (this.classId == null || this.classId === undefined || this.classId === 'undefined') {
      this.router.navigateByUrl('/dashboard');
    }

    if (localStorage.classBg == null || localStorage.classBg === undefined || localStorage.classBg === 'undefined') {
      this.idImageBgClass = 1;
    } else {
      this.idImageBgClass = Number(localStorage.classBg);
    }
    this.imgUrl = 'assets/img/classBg/' + this.idImageBgClass + '.jpg';
    this.lstClassBgImg = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6},
    ];

    // Get info user:
    const userId = JSON.parse(localStorage.currentUser).id;
    this.classService.getUserDetail(userId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objLoggedUser = response.body;
        }
      });

    // Get class detail:
    this.classService.getClassDetail(this.classId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objClass = response.body;
        }
      });

    // Get all cmt:
    this.classRoomService.getAllComment(this.classId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          console.log(response.body)
        }
      });

    this.lstClassWork = [
      {
        id: '1',
        title: 'Test1',
        endDate: '08/08/2020'
      },
      {
        id: '2',
        title: 'Test2',
        endDate: '08/08/2020'
      }
    ];

    this.lstCmt = [
      {
        id: 1,
        content: 'Test',
        creatAt: '08:08 08/08/2020',
        urlFile: 'assets/img/avatars/8.jpg',
        author: {
          id: '1',
          imgUrl: 'assets/img/avatars/4.jpg',
          name: 'Nguyen'
        },
        subCmt: [
          {
            id: 1,
            content: 'Test',
            creatAt: '08:08 08/08/2020',
            author: {
              id: '1',
              imgUrl: 'assets/img/avatars/4.jpg',
              name: 'Nguyen'
            }
          }
        ]
      }

    ];

  }

  getFileName(strUrl: string) {
    return strUrl.split('/').slice(-1)[0];
  }

  getTypeFile(strUrl: string) {
    const extension = strUrl.split('.').pop();
    if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'psd'].includes(extension)) {
      return 'Hình ảnh';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'Word';
    } else if (['xls', 'xlsx'].includes(extension)) {
      return 'Excel';
    } else if (['pdf'].includes(extension)) {
      return 'PDF';
    }
    return '';
  }

  getPreviewImgByFileType(strUrl: string) {
    const extension = strUrl.split('.').pop();
    if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'psd'].includes(extension)) {
      return strUrl;
    } else if (['doc', 'docx'].includes(extension)) {
      return 'assets/img/word-file-icon.jpg';
    } else if (['xls', 'xlsx'].includes(extension)) {
      return 'assets/img/excel-icon.png';
    } else if (['pdf'].includes(extension)) {
      return 'assets/img/pdf-file-icon-svg.png';
    }
    return 'assets/img/document.jpg';
  }

  chooseImg() {
    this.imgUrl = this.imgUrl = 'assets/img/classBg/' + this.idImageBgClass + '.jpg';
    localStorage.setItem('classBg', this.idImageBgClass.toString());
  }

  onClickImg(id: string) {
    this.lstClassBgImg.forEach(item => {
      if (item.id !== id) {
        item.isClick = false;
      }
    });
  }

  onClickModalChooseImg() {
    this.lstClassBgImg.forEach(item => {
      if (item.id === this.idImageBgClass) {
        item.isClick = true;
      } else {
        item.isClick = false;
      }
    });
  }

  onCancelModalChooseImg() {
    this.idImageBgClass = Number(localStorage.classBg) || 1;
  }

  getInfoFromDescription(des: string, index: number) {
    return des == null ? '' : des.split(',')[index].split(':')[1];
  }
}
