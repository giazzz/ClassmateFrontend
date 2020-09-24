import { HostListener } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { error } from 'protractor';
import { Observable, Subject } from 'rxjs';
import { EndpointsConfig } from '../../config/config';
import { CheckRole } from '../../shared/checkRole';
import { Toastr } from '../../shared/toastr';
import { ClassRoomService } from '../class-room/class-room.service';
import { SettingService } from './setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  public strUserId: string;
  public objProfile: any;
  public defaultAvatar = EndpointsConfig.user.defaultAvatar;
  public frmEdit: FormGroup;
  public submitted: boolean;
  public loading: boolean = false;
  public isStudent: boolean = false;
  public selectedFile: File;
  public driveUrl = EndpointsConfig.google.driveUrl;
  public blnIsForProfile: boolean = false;
  public vnf_regex: RegExp = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;

  // Webcam
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 640},
    height: {ideal: 480}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  private width: number;
  private height: number;

  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('imageModal') public imageModal: ModalDirective;

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    this.width = win.innerWidth;
    this.height = win.innerHeight;
  }

  constructor(private settingService: SettingService,
              private iconLoading: NgxUiLoaderService,
              private fb: FormBuilder,
              private classRoomService: ClassRoomService,
              private role: CheckRole,
              private toastr: Toastr
  ) {
    this.onResize();
  }

  ngOnInit(): void {
    this.iconLoading.start();
    this.strUserId = JSON.parse(localStorage.currentUser).id || '';
    this.isStudent = this.role.isStudent();
    this.getProfile();

    this.frmEdit = this.fb.group({
      inputName: ['', [
        Validators.required
      ]],
      inputPhone: ['', [
        Validators.required,
        Validators.pattern(this.vnf_regex)
      ]],
      inputAddress: ['', [
        Validators.required
      ]],
      selectBirthday: ['', [
        Validators.required
      ]],
      selectGender: ['', [
        Validators.required
      ]],
      selectAllowInfo: ['PUBLIC', [
      ]]
    });

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  get f() { return this.frmEdit.controls; }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.showWebcam = !this.showWebcam;
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  getProfile() {
    this.settingService.getProfile(this.strUserId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objProfile = response.body;
        }
        this.loading = false;
        this.iconLoading.stop();
      },
      () => {
        this.loading = false;
        this.iconLoading.stop();
      });
  }

  onClickShowFormEdit() {
    this.frmEdit.setValue({
      inputName: this.objProfile.fullname,
      inputPhone: this.objProfile.phone,
      inputAddress: this.objProfile.address,
      selectBirthday: this.convertTickToDate(this.objProfile.birthday) || null,
      selectGender: this.convertGenderToInt(this.objProfile.gender),
      selectAllowInfo: this.objProfile.profile_visibility
    });
  }

  onSubmitFormEdit() {
    this.submitted = true;
    this.loading = true;

    // Stop here if form is invalid
    if (this.frmEdit.invalid) {
      this.loading = false;
      return;
    }
    const fullname = this.f.inputName.value;
    const phone = this.f.inputPhone.value;
    const address = this.f.inputAddress.value;
    const birthday = this.getTicksFromDateString(this.f.selectBirthday.value);
    const gender = Number(this.f.selectGender.value);
    const avatar_file_id = this.objProfile.avatar_file_id;
    const civil_id = this.objProfile.civil_id;
    const profile_visibility = this.f.selectAllowInfo.value;
    const objProfile = {fullname, phone, address, birthday, gender, civil_id, avatar_file_id, profile_visibility};

    this.settingService.updateProfile(objProfile)
      .subscribe(
        response => {
          if (response.status === 200 && response.body.success === true) {
            // Success:
            this.addModal.hide();
            this.getProfile();
            this.toastr.showToastrSuccess('', 'Cập nhật thông tin thành công');
          }
          this.loading = false;
        },
        () => {
          // Error:
          this.toastr.showToastrWarning('', 'Không thành công');
          this.loading = false;
        });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.updateAvatar([event.target.files[0]]);
    }
  }

  onClickSaveImage() {
    const imgName = this.strUserId + (new Date()).getTime();
    const data = this.webcamImage?.imageAsDataUrl;
    const fileImg = this.dataURLtoFile(data, imgName + '.png');
    if (this.blnIsForProfile) {
      this.updateAvatar([fileImg]);
    } else {
      this.uploadImgFaceCheck([fileImg]);
    }
  }

  updateAvatar(lstFile) {
    this.loading = true;
      this.classRoomService.uploadFile(lstFile).subscribe(
        response => {
          if (response.body != null && response.body !== undefined && response.body.length > 0) {
            this.objProfile.avatar_file_id = response.body[0].file_id;
            this.settingService.updateProfile(this.objProfile).subscribe(
              data => {
                if (data.status === 200 && data.body.success === true) {
                  // Success:
                  this.addModal.hide();
                  this.imageModal.hide();
                  this.getProfile();
                  this.toastr.showToastrSuccess('', 'Cập nhật ảnh thành công!');
                }
                setTimeout(() => {
                  this.loading = false;
                }, 500);
              },
              () => {
                // Error:
                this.toastr.showToastrWarning('', 'Không thành công');
                setTimeout(() => {
                  this.loading = false;
                }, 500);
              });
          }
          setTimeout(() => {
            this.loading = false;
          }, 500);
        },
        () => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
  }

  uploadImgFaceCheck(lstFile) {
    this.loading = true;
      this.classRoomService.uploadFile(lstFile).subscribe(
        response => {
          if (response.body != null && response.body !== undefined && response.body.length > 0) {
            const lstImgId = response.body.map(item => {
              return item.file_id;
            });

            this.settingService.faceCheckDefinition({file_ids: lstImgId}).subscribe(
              data => {
                if (data.status === 200 && data.body.success === true) {
                  // Success:
                  this.imageModal.hide();
                  this.toastr.showToastrSuccess('Đã lưu ảnh!', 'Thành công');
                } else {
                  setTimeout(() => {
                    this.loading = false;
                  }, 500);
                }
              },
              () => {
                // Error:
                this.toastr.showToastrWarning('', 'Không thành công');
                setTimeout(() => {
                  this.loading = false;
                }, 500);
              });
          }
          setTimeout(() => {
            this.loading = false;
          }, 500);
        },
        () => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
  }

  getTicksFromDateString(dateTime: string) {
    const date = new Date(dateTime);
    return date.getTime();
  }

  convertTickToDate(tick: string) {
    const date = new Date(Number(tick));
    return moment(date).format('YYYY-MM-DD');
  }

  convertTickToDateTime(tick: string) {
    const date = new Date(Number(tick));
    return moment(date).format('DD/MM/YYYY');
  }

  convertGenderToInt(strGender) {
    switch (strGender) {
      case 'MALE':
        return '1';
      case 'FEMALE':
        return '2';
      default:
        return '3';
    }
  }

  convertGenderToVN(strGender) {
    switch (strGender) {
      case 'MALE':
        return 'Nam';
      case 'FEMALE':
        return 'Nữ';
      default:
        return 'Khác';
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while ( n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }

}
