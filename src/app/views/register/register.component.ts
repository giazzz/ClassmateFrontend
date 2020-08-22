import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  public frmRegister: FormGroup;

  constructor(private fb: FormBuilder
  ) {
  }
  ngOnInit(): void {
    this.frmRegister = this.fb.group({
      inputUsername: ['', [
        Validators.required
      ]],
      inputEmail: ['', [
        Validators.required
      ]],
      inputPwd: ['', [
        Validators.required
      ]],
      inputConfirmPwd: ['', [
        Validators.required
      ]],
      radioRole: ['', [
        Validators.required
      ]]
    });
  }

  get f() { return this.frmRegister.controls; }
}
