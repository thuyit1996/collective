import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppState } from '../../../core/store/app.state';
import { Store, select } from '@ngrx/store';
import { registerUser } from '../../../core/store/auth/auth.actions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from '../../../utils/password-validation';
import { AlertService } from '../../../shared/services/alert.service';
import { Title } from "@angular/platform-browser";
import { OperatorUtils } from '../../../core/utils/operators.util';
import { selectUserStatus } from '../../../core/store/auth/auth.selector';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class RegisterComponent implements OnInit {
  vm$: Observable<any>;
  registerFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Register');
    this.$register_onCreateFormHandler();
    this.$register_getViewModel();
  }

  $register_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<any>({
      isLoading: this.store.pipe(select(selectUserStatus), map(status => status === 'loading'))
    });
  }

  $register_onRegister() {

    this.$register_validatorForm();
  }

  $register_onCreateFormHandler() {
    this.passwordFormGroup = this.formBuilder.group({
      Password: ['', Validators.required],
      Confirmpassword: ['', Validators.required],
    }, {
      validator: PasswordValidator.validate.bind(this)
    });
    this.registerFormGroup = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
    })
  }

  $register_getValueForm() {
    return {
      ...this.registerFormGroup.value,
      ...this.passwordFormGroup.value
    }
  }

  $register_validatorForm() {
    let password = this.passwordFormGroup.controls.Password.value;
    let confirmPassword = this.passwordFormGroup.controls.Confirmpassword.value;
    let email = this.registerFormGroup.controls.Email.value;
    let emailInvalid = this.registerFormGroup.controls.Email.invalid;
    let lowerCase = password.match((/[a-z]+/g));
    let upperCase = password.match((/[A-Z]+/g));
    let digits = password.match((/[\d]+/g));
    let special = password.match((/[!@#$%^&*_]+/g));
    let lenght = password.match((/[A-Za-z\d!@#$%^&*_]{8,}/g));
    if (!email) {
      this.alertService.errorAlert('Email is required !');
      return;
    }
    if (emailInvalid) {
      this.alertService.errorAlert('Email is invalid !');
      return;
    }
    if (password === '') {
      this.alertService.errorAlert('Password is required !');
      return;
    }
    if (lowerCase === null) {
      this.alertService.errorAlert('Password have at least one lowercase !');
      return;
    }
    if (upperCase === null) {
      this.alertService.errorAlert('Password have at least one uppercase !');
      return;
    }
    if (digits === null) {
      this.alertService.errorAlert('Password have at least one digits !');
      return;
    }
    if (special === null) {
      this.alertService.errorAlert('Password have at least one special charater !');
      return;
    }
    if (lenght === null) {
      this.alertService.errorAlert('Passwrod have at least it should have 8 characters long !');
      return;
    }
    if (!confirmPassword) {
      this.alertService.errorAlert('Confirm password is required !');
      return;
    }
    if (password !== confirmPassword) {
      this.alertService.errorAlert('Confirm password and password not match !');
      return;
    }
    let valueForm = this.$register_getValueForm();
    this.store.dispatch(registerUser({ registerPayload: valueForm }));
  }
}
