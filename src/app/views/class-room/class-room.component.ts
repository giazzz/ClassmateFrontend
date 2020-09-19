import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { ClassMateService } from '../classmate.service';
import * as $ from 'jquery';
import { EndpointsConfig } from '../../config/config';
import { ClassRoomService } from './class-room.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { CheckRole } from '../../shared/checkRole';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PopoverModule } from 'ngx-smart-popover';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../dashboard/dashboard.service';
import { Toastr } from '../../shared/toastr';

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
  public lstClassWorkSoon: any[] = [];
  public lstAllData = [];
  public lstPost = [];
  public lstCmtByPostId: any[] = [];
  public lstClassBgImg: any[] = [];
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;
  public driveUrl = EndpointsConfig.google.driveUrl;
  public strCmtContent: string;
  public strPostContent: string;
  public userId: string;
  public blnDisableClick: boolean = false;
  public lstSelectedFile = [];
  public loading: boolean = false;
  public blnCanEditCmt: boolean = false;
  public isTeacher: boolean = false;
  public isUpdate: boolean = false;
  public currentFile;
  public currentPost;
  public frmEdit: FormGroup;
  public submitted: boolean;
  public lstAllCourseCtgr = [];
  public objTeacher;

  public minStartDate = this.convertTickToDateDPicker((new Date()).getTime());

  @ViewChild('inputPost', {static: true}) InputPost: ElementRef<any>;
  @ViewChild('updateModal') public updateModal: ModalDirective;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private classService: ClassMateService,
              private classRoomService: ClassRoomService,
              public sanitizer: DomSanitizer,
              public role: CheckRole,
              private iconLoading: NgxUiLoaderService,
              private fb: FormBuilder,
              private dashBoardService: DashboardService,
              private toastr: Toastr
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.iconLoading.start();
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
    this.isTeacher = this.role.isTeacher();
    this.lstClassBgImg = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6},
    ];

    // Get info user:
    this.userId = JSON.parse(localStorage.currentUser).id;
    this.classService.getUserDetail(this.userId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objLoggedUser = response.body;
        }
      });

    // Get class detail:
    this.getCurrentCourse();

    this.dashBoardService.getAllCourseCategory().subscribe(
      response => {
        if (response.body !== null && response.body !== undefined) {
          this.lstAllCourseCtgr = response.body;
        }
      });

    this.classRoomService.getAllProfileInCourse(this.classId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objTeacher = response.body.teacher;
        }
      });

    // Get all post:
    this.getAllPost();
    // Get all ex:
    this.getAllExerciseByCourse();

    this.frmEdit = this.fb.group({
      inputName: ['', [
        Validators.required
      ]],
      inputDes: ['', [
        Validators.required
      ]],
      selectCategory: ['', [
        Validators.required
      ]],
      inputBeginDate: ['', [
        Validators.required
      ]],
      inputEndDate: ['', [
        Validators.required
      ]]
    });

  }

  get f() { return this.frmEdit.controls; }

  getCurrentCourse() {
    this.classService.getClassDetail(this.classId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objClass = response.body;
        }
      });
  }

  getAllPost() {
    this.classRoomService.getAllPostByCourseId(this.classId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.lstPost = response.body.sort((val1, val2) => {
            return Number(val2.created_at) - Number(val1.created_at);
          });
        }
        setTimeout(() => {
          this.iconLoading.stop();
        }, 1000);
      },
      error => {
        setTimeout(() => {
          this.iconLoading.stop();
        }, 1000);
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

  onClickRemoveSelectedFile(item, blnDeleteFileUploaded = false) {
    if (!blnDeleteFileUploaded) {
      const index = this.lstSelectedFile.indexOf(item);
      this.lstSelectedFile.splice(index, 1);
    } else {
      const index = this.currentPost.attachmentResponses.indexOf(item);
      this.currentPost.attachmentResponses.splice(index, 1);
    }
  }

  // Convert file to base64data:
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

  onClickAddCmt(objPost) {
    this.blnDisableClick = true;
    if (objPost.strCmtContent == null || objPost.strCmtContent === undefined || objPost.strCmtContent === '') {
      this.blnDisableClick = false;
      return;
    }
    this.loading = true;
    this.classRoomService.addCmtToPost(objPost.id, {content: objPost.strCmtContent}).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.getAllPost();
          objPost.strCmtContent = null;
          this.blnDisableClick = false;
          this.loading = false;
        }
      },
      error => {
        objPost.strCmtContent = null;
        this.blnDisableClick = false;
        this.loading = false;
      });
  }

  onClickDeletePost(postId: string) {
    this.classRoomService.deletePost(postId).subscribe(
      response => {
        if (response != null && response !== undefined && response.success) {
          this.getAllPost();
        }
      },
      error => {
      });
  }

  onClickDeleteCmt(cmtId: string) {
    this.classRoomService.deleteCmt(cmtId).subscribe(
      response => {
        if (response != null && response !== undefined && response.success) {
          this.getAllPost();
        }
      },
      error => {
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

  onClickUpdateCmt(objPost, cmt) {
    objPost.strCmtContent = cmt.content;
    objPost.isUpdate = true;
    objPost.cmtIdUpdate = cmt.id;
    setTimeout(() => {
      $('#cmt-' + objPost.id).trigger('focus');
    }, 300);
  }

  onSubmitUpdateCmt(objPost) {
    this.loading = true;
    this.classRoomService.updateCmt(objPost.cmtIdUpdate, {content: objPost.strCmtContent}).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.getAllPost();
          objPost.strCmtContent = null;
          this.blnDisableClick = false;
          this.loading = false;
        }
      },
      error => {
        objPost.strCmtContent = null;
        this.blnDisableClick = false;
        this.loading = false;
      });
  }

  onClickUpdatePost(postId) {
    this.classRoomService.getPostDetail(postId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.currentPost = response.body;
          this.isUpdate = true;
          setTimeout(() => {
            $('#textarea-input-update').trigger('focus');
          }, 300);
        }
      },
      error => {
      });
  }

  onSubmitUpdatePost() {
    if (this.currentPost.content == null || this.currentPost.content === undefined
        || this.currentPost.content === '' || this.lstSelectedFile === []) {
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
          const lstFile = this.currentPost.attachmentResponses;
          response.body.forEach(item => {
            lstFile.push(
              {
                name: item.file_name,
                description: item.file_name,
                file_id: item.file_id,
                file_size: item.file_size
              });
          });

          // Update post:
          const objPost = {
            content: this.currentPost.content,
            attachmentRequests: lstFile
          };
          this.classRoomService.updatePost(objPost, this.currentPost.id).subscribe(
            data => {
              if (data.body != null && data.body !== undefined) {
                this.getAllPost();
                this.currentPost = null;
                this.lstSelectedFile = [];
                this.isUpdate = false;
                this.loading = false;
              }
            },
            error => {
              this.currentPost = null;
              this.lstSelectedFile = [];
              this.isUpdate = false;
              this.loading = false;
            });
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }

  getAllExerciseByCourse() {
    this.classRoomService.getAllExcerciseByCourseId(this.classId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.lstClassWork = response.body;
          this.lstClassWorkSoon = response.body.filter( item => this.oneWeekExpired(item.exercise_end_time) );
        }
      });
  }

  convertTickToDate(tick) {
    const date = new Date(Number(tick));
    return moment(date).format('D & M YYYY hh:mm').replace('&', 'thg');
  }

  convertTickToDateShort(tick) {
    const date = new Date(Number(tick));
    return moment(date).format('D & M YYYY').replace('&', 'thg');
  }

  convertTickToDateDPicker(tick) {
    const date = new Date(Number(tick));
    return moment(date).format('YYYY-MM-DD');
  }

  convertDateToTicks(dateTime) {
    const date = new Date(dateTime);
    return date.getTime();
  }

  oneWeekExpired(endTicks): boolean {
    const endDate = Number(endTicks);
    const now = (new Date()).getTime();
    const addOneWeek = (new Date()).setDate((new Date()).getDate() + 7);
    return now <= endDate && endDate <= addOneWeek;
  }

  onClickShowModalEdit() {
    this.frmEdit.setValue({
      inputName: this.objClass.name,
      inputDes: this.objClass.description,
      selectCategory: this.objClass.course_category_id,
      inputBeginDate: this.convertTickToDateDPicker(this.objClass.start_date),
      inputEndDate: this.convertTickToDateDPicker(this.objClass.end_date)
    });
  }

  onSubmitFormEditCourse() {
    this.submitted = true;
    this.loading = true;

    // Stop here if form is invalid
    if (this.frmEdit.invalid) {
      this.loading = false;
      return;
    }
    const name = this.f.inputName.value;
    const description = this.f.inputDes.value;
    const start_date = this.convertDateToTicks(this.f.inputBeginDate.value);
    const end_date = this.convertDateToTicks(this.f.inputEndDate.value);
    const course_category_id = this.f.selectCategory.value;
    const objCourse = {course_category_id, name, description, start_date, end_date};

    this.classRoomService.updateCourse(this.objClass.id, objCourse)
      .subscribe(
        response => {
          if (response.status === 200 && response.body.success) {
            // Success:
            this.updateModal.hide();
            this.getCurrentCourse();
          }
          this.loading = false;
        },
        error => {
          // Error:
          this.loading = false;
          this.updateModal.hide();
          this.toastr.showToastrWarning('Bạn không thể sửa khi lớp học đang trong trạng thái đang hoạt động', 'Không thành công');
        });
  }

  getCtgrname(ctgrId) {
    return this.lstAllCourseCtgr.find( item => item.id === ctgrId)?.name || null;
  }

  onChangeStatus() {
    this.classRoomService.updateCourseStatus(this.objClass.id, this.objClass.status).subscribe(
      response => {
        if (response.status === 200 && response.body.success) {
          // Success:
          this.toastr.showToastrSuccess('', 'Thành công!');
        }
      },
      error => {
        // Error:
        this.toastr.showToastrWarning('', 'Không thành công');
      });
  }

}
