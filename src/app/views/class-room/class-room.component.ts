import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { ClassMateService } from '../classmate.service';
import * as $ from 'jquery';
import { EndpointsConfig } from '../../config/config';
import { ClassRoomService } from './class-room.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

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
  public strClassDes = '';
  public objLoggedUser;
  public blnIsClick: boolean = false;
  public lstClassWork: any[] = [];
  public lstPost = [];
  public lstCmtByPostId: any[] = [];
  public lstClassBgImg: any[] = [];
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;
  public driveUrl = EndpointsConfig.google.driveUrl;
  public strCmtContent: string;
  public strPostContent: string;
  public blnDisableClick: boolean = false;
  public lstSelectedFile = [];
  public loading: boolean = false;
  public currentFile;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private classService: ClassMateService,
              private classRoomService: ClassRoomService,
              public sanitizer: DomSanitizer
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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

    // Get all post:
    this.getAllPost();

    // this.lstClassWork = [
    //   {
    //     id: '1',
    //     title: 'Test1',
    //     endDate: '08/08/2020'
    //   },
    //   {
    //     id: '2',
    //     title: 'Test2',
    //     endDate: '08/08/2020'
    //   }
    // ];

  }

  getAllPost() {
    this.classRoomService.getAllPostByCourseId(this.classId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.lstPost = response.body;
          this.lstPost.sort((val1, val2) => {
            return Number(val2.created_at) - Number(val1.created_at);
          });
        }
      });
  }

  getFileName(strUrl: string) {
    if (strUrl != null && strUrl !== undefined && strUrl !== '') {
      return strUrl.split('/').slice(-1)[0];
    }
  }

  getTypeFile(strUrl: string) {
    if (strUrl != null && strUrl !== undefined && strUrl !== '') {
      const extension = strUrl.split('.').pop();
      if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'psd', 'svg'].includes(extension)) {
        return 'Hình ảnh';
      } else if (['doc', 'docx'].includes(extension)) {
        return 'Word';
      } else if (['xls', 'xlsx'].includes(extension)) {
        return 'Excel';
      } else if (['pdf'].includes(extension)) {
        return 'PDF';
      } else if (['txt'].includes(extension)) {
        return 'Text';
      }
    }
    return '';
  }

  getPreviewImgByFileType(strUrl: string, fileId: string, blnIsPreview = false) {
    if (strUrl != null && strUrl !== undefined && strUrl !== '') {
      const extension = strUrl.split('.').pop();
      if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'psd', 'svg'].includes(extension)) {
        return !blnIsPreview ? this.driveUrl + fileId : fileId;
      } else if (['doc', 'docx'].includes(extension)) {
        return 'assets/img/word-file-icon.jpg';
      } else if (['xls', 'xlsx'].includes(extension)) {
        return 'assets/img/excel-icon.png';
      } else if (['pdf'].includes(extension)) {
        return 'assets/img/pdf-file-icon-svg.png';
      }
      return 'assets/img/document.png';
    }
    return 'assets/img/document.png';
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
    return des === '' || des == null || des === undefined ? '' : des.split(',')[index].split(':')[1];
  }

  convertTickToDate(tick: string) {
    const date = new Date(Number(tick));
    return moment(date).format('D & M YYYY hh:mm').replace('&', 'thg');
  }

  onClickAddCmt(postId: string) {
    this.blnDisableClick = true;
    if (this.strCmtContent == null || this.strCmtContent === undefined || this.strCmtContent === '') {
      this.blnDisableClick = false;
      return;
    }
    this.classRoomService.addCmtToPost(postId, {content: this.strCmtContent}).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.getAllPost();
          this.strCmtContent = null;
          this.blnDisableClick = false;
        }
      },
      error => {
        this.strCmtContent = null;
        this.blnDisableClick = false;
      });
  }

  async onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.lstSelectedFile.push(
          {
            file: event.target.files[i],
            url: await this.getBase64(event.target.files[i])
          });
      }
    }
  }

  onClickRemoveSelectedFile(item) {
    const index = this.lstSelectedFile.indexOf(item);
    this.lstSelectedFile.splice(index, 1);
  }

  getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onClickAddPost() {
    if (this.strPostContent == null || this.strPostContent === undefined || this.strPostContent === '' || this.lstSelectedFile === []) {
      return;
    }
    this.loading = true;
    // Upload files:
    const lstFileUpload = this.lstSelectedFile.map(item => {
      return item.file;
    });
    this.classRoomService.uploadFile(lstFileUpload).subscribe(
      response => {
        if (response.body != null && response.body !== undefined && response.body.length > 0) {
          const lstFile = [];
          response.body.forEach(item => {
            lstFile.push(
              {
                name: item.file_name,
                description: item.file_name,
                file_id: item.file_id,
                file_size: item.file_size
              });
          });

          // Add post:
          const objPost = {
            content: this.strPostContent,
            attachmentRequests: lstFile
          };
          this.classRoomService.addPost(objPost, this.classId).subscribe(
            data => {
              if (data.body != null && data.body !== undefined) {
                this.getAllPost();
                this.strPostContent = null;
                this.lstSelectedFile = [];
                this.blnIsClick = false;
                this.loading = false;
              }
            },
            error => {
              this.strPostContent = null;
              this.lstSelectedFile = [];
              this.blnIsClick = false;
              this.loading = false;
            });
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }

  onClickReadFile(file) {
    this.currentFile = {
      name: file.name,
      url: this.sanitizer.bypassSecurityTrustResourceUrl('https://drive.google.com/file/d/' + file.file_id + '/preview?hl=en&pid=explorer&efh=false&a=v&chrome=false&embedded=true')
    };
  }

  onClickReadFilePreview(file) {
    this.currentFile = {
      name: file.file.name,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(file.url)
    };
  }

}
