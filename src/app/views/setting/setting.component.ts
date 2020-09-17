import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EndpointsConfig } from '../../config/config';
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

  constructor(private settingService: SettingService,
              private iconLoading: NgxUiLoaderService,
              private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.strUserId = JSON.parse(localStorage.currentUser).id || '';

    this.settingService.getProfile(this.strUserId).subscribe(
      response => {
        if (response.body != null && response.body !== undefined) {
          this.objProfile = response.body;
        }
      });

    this.frmEdit = this.fb.group({
      inputName: ['', [
        Validators.required
      ]],
      inputPhone: ['', [
        Validators.required
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
  }

  get f() { return this.frmEdit.controls; }

}
