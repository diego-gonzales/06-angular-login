import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { showSweetalertLoading, closeSweetalertLoading } from '../../../../shared/helpers/sweetalert.helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user!: User;
  myLoginForm: FormGroup = this.fb.group({
    email:    [ '', [Validators.required, Validators.email] ],
    password: [ '', [Validators.required, Validators.minLength(6)] ]
  });
  rememberUserControl: FormControl = new FormControl(false);


  constructor(private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {
    this.readRememberedUser();
  }


  onSubmit() {
    const { email, password } = this.myLoginForm.value;

    if(this.myLoginForm.invalid) {
      this.myLoginForm.markAllAsTouched();
      return;
    };

    showSweetalertLoading('Authenticating, wait a moment...');

    this.user = new User(email, password);
    this.authenticationService.login(this.user)
        .subscribe(resp => {
          console.log(resp)
          closeSweetalertLoading();
          this.checkRememberUserInput();
          this.router.navigateByUrl('/home');
        });
  };

  checkRememberUserInput() {
    if (this.rememberUserControl.value) {
      localStorage.setItem('email', this.user.email);
    } else {
      localStorage.removeItem('email');
    };
  };

  readRememberedUser() {
    if (localStorage.getItem('email')) {
      this.myLoginForm.reset({
        email: localStorage.getItem('email')
      });
      this.rememberUserControl.reset(true);
    };
  };

  formControlIsInvalid(controlName: string) {
    return this.myLoginForm.get(controlName)?.invalid && this.myLoginForm.get(controlName)?.touched;
  };

  get emailErrorMessage(): string {
    const errors = this.myLoginForm.get('email')?.errors;

    if (errors?.required) {
      return 'El email es obligatorio';
    } else if (errors?.email) {
      return 'Ingrese un email válido';
    } else {
      return ''
    };
  };
}
