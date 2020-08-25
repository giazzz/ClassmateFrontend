import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy{

  //#region properties
  public userFormControl: FormControl;

  public passwordControl: FormControl;

  public loginFormGroup: FormGroup;
  //#endregion
  constructor(protected fb: FormBuilder) {
  }

  public ngOnInit(): void {}

  public submit(): void {

  }
  public ngOnDestroy(): void {}

  public forgotPassword(): void {

  }
}
