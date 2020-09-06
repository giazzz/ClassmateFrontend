import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../register/register.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  public frmLogin: FormGroup;
  public submitted: boolean;

  constructor(private fb: FormBuilder,
              private resService: RegisterService,
              private iconLoading: NgxUiLoaderService,
              private route: ActivatedRoute,
              private router: Router,
              private authenService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenService.currentUserValue) {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.submitted = false;

    this.frmLogin = this.fb.group({
      inputUsername: ['', [
        Validators.required,
      ]],
      inputPassword: ['', [
        Validators.required,
      ]]
    });

  }

  get f() { return this.frmLogin.controls; }

  onSubmit() {
    this.submitted = true;
    // Stop here if form is invalid
    if (this.frmLogin.invalid) {
        return;
    }

    this.authenService.login(this.f.inputUsername.value, this.f.inputPassword.value).subscribe(
      data => {
        this.router.navigateByUrl('/dashboard');
      },
      error => {
      });
  }

}
