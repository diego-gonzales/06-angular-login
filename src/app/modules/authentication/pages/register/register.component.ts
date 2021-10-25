import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { showSweetalertLoading, closeSweetalertLoading } from '../../../../shared/helpers/sweetalert.helper';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user!: User;
  myRegisterForm: FormGroup = this.fb.group({
    email:    [ '', [Validators.required, Validators.email] ],
    name:     [ '', [Validators.required] ],
    password: [ '', [Validators.required, Validators.minLength(6)] ]
  });
  rememberUserControl: FormControl = new FormControl(false);


  constructor(private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void { }


  onSubmit() {
    const { email, name, password } = this.myRegisterForm.value;

    if (this.myRegisterForm.invalid || name.trim() === '') {
      this.myRegisterForm.markAllAsTouched();
      return;
    };

    showSweetalertLoading('Registering, wait a moment...');

    this.user = new User(email, password, name.trim());
    this.authenticationService.register(this.user)
        .subscribe(resp => {
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

  formControlIsInvalid(controlName: string) {
    return this.myRegisterForm.get(controlName)?.invalid && this.myRegisterForm.get(controlName)?.touched;
  };

  get emailErrorMessage(): string {
    const errors = this.myRegisterForm.get('email')?.errors;

    if (errors?.required) {
      return 'El email es obligatorio';
    }
    else if (errors?.email) {
      return 'Ingrese un email válido';
    } else {
      return '';
    };
  };

}
