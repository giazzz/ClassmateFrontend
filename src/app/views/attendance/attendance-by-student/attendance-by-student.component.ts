import { Component, OnInit, HostListener } from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-attendance-by-student',
  templateUrl: './attendance-by-student.component.html',
  styleUrls: ['./attendance-by-student.component.scss']
})
export class AttendanceByStudentComponent implements OnInit {

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public canSubmit: boolean;
  public isAttendanced: boolean;
  public cloud_name = 'dev20';
  public upload_preset = 'gfj9avei';

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

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    this.width = win.innerWidth;
    this.height = win.innerHeight;
  }
  constructor() {
    this.onResize();
  }

  ngOnInit(): void {
    this.canSubmit = false;
    this.isAttendanced = false;

    // Check isAttendanced if true -> return:
    // this.isAttendanced = true;



    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

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
    this.canSubmit = true;
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

  onClickAttendance(){
    console.log(this.webcamImage?.imageAsDataUrl);
    const imgName = 'tenSinhVienAndDate';
    const data = this.webcamImage?.imageAsDataUrl;
    const fileImg = this.dataURLtoFile(data, imgName + '.png');
    this.uploadFileToCloudinary(fileImg);

  }

  uploadFileToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloud_name}/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');


    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // File uploaded successfully
        const response = JSON.parse(xhr.responseText);
        console.log(response.secure_url)
        this.isAttendanced = true;

      }
    };

    fd.append('upload_preset', this.upload_preset);
    fd.append('tags', 'attendance_upload');
    fd.append('file', file);
    xhr.send(fd);
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
