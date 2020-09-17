import { Component, OnInit } from '@angular/core';
import { SettingService } from './setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  public strUserId: string;
  public objProfile: any;

  constructor( private settingService: SettingService
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
  }

}
