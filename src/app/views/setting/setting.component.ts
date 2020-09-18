import { HostListener } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { EndpointsConfig } from '../../config/config';
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
  public selectedFile: File;
  public driveUrl = EndpointsConfig.google.driveUrl;
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
              private classRoomService: ClassRoomService
  ) {
    this.onResize();
  }

  ngOnInit(): void {
    this.strUserId = JSON.parse(localStorage.currentUser).id || '';

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
      });
  }

  onClickShowFormEdit() {
    this.frmEdit.setValue({
      inputName: this.objProfile.fullname,
      inputPhone: this.objProfile.phone,
      inputAddress: this.objProfile.address,
      selectBirthday: this.convertTickToDate(this.objProfile.birthday) || null,
      selectGender: this.convertGenderToInt(this.objProfile.gender)
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
    const objProfile = {fullname, phone, address, birthday, gender, civil_id, avatar_file_id};

    this.settingService.updateProfile(objProfile)
      .subscribe(
        response => {
          if (response.status === 200 && response.body.success === true) {
            // Success:
            this.addModal.hide();
            this.getProfile();
          }
          this.loading = false;
        },
        error => {
          // Error:
          this.loading = false;
        });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.loading = true;
      this.classRoomService.uploadFile([event.target.files[0]]).subscribe(
        response => {
          if (response.body != null && response.body !== undefined && response.body.length > 0) {
            this.objProfile.avatar_file_id = response.body[0].file_id;
            this.settingService.updateProfile(this.objProfile).subscribe(
              data => {
                if (data.status === 200 && data.body.success === true) {
                  // Success:
                  this.addModal.hide();
                  this.getProfile();
                }
                this.loading = false;
              },
              error => {
                // Error:
                this.loading = false;
              });
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
        });
    }
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
