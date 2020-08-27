import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public frmRegister: FormGroup;
  public submitted: boolean;
  public regexPassword: RegExp;
  public blnIsNameExisted: boolean;
  public blnIsMailExisted: boolean;

  constructor(private fb: FormBuilder,
              private resService: RegisterService,
              private iconLoading: NgxUiLoaderService
  ) {
  }
  ngOnInit(): void {
    this.submitted = false;
    this.regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/;
    this.blnIsMailExisted = false;
    this.blnIsNameExisted = false;

    this.frmRegister = this.fb.group({
      inputUsername: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]],
      inputEmail: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ]],
      inputPwd: ['', [
        Validators.required,
        Validators.pattern(this.regexPassword),
        Validators.minLength(6),
        Validators.maxLength(200)
      ]],
      inputConfirmPwd: ['', [
        Validators.required,
        Validators.pattern(this.regexPassword),
        Validators.maxLength(200)
      ]],
      radioRole: ['teacher', [
        Validators.required
      ]]
    }, {validator: mustMatch('inputPwd', 'inputConfirmPwd')});
  }

  get f() { return this.frmRegister.controls; }

  onSubmit() {
    this.submitted = true;
    this.iconLoading.start();
    this.blnIsMailExisted = false;
    this.blnIsNameExisted = false;
    // Stop here if form is invalid
    if (this.frmRegister.invalid) {
      this.iconLoading.stop();
      return;
    }
    const username = this.f.inputUsername.value;
    const email = this.f.inputEmail.value;
    const password = this.f.inputPwd.value;
    const role = this.f.radioRole.value;

    const objAcc = {username, password, email, role: [role]};


    this.resService.register(objAcc)
      .subscribe(
        response => {
          const successMsg = 'User registered successfully!';
          if (response.status === 200 && response.body.message === successMsg) {
            // Success:
          }
          this.iconLoading.stop();
        },
        error => {
          // Error:
          const errUsername = 'Error: Username is already in use!';
          const errEmail = 'Error: Email is already in use!';
          if (error?.error?.message === errUsername) {
            this.blnIsNameExisted = true;
          } else if (error.error.message === errEmail) {
            this.blnIsMailExisted = true;
          }
          this.iconLoading.stop();
        });
  }

  getUser = async (id) => {
    try {
      const res = await this.resService.getUser(id);
      if (res) {
        console.log(res);
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ notMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  };
}
