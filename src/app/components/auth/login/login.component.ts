import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';
import { loginUser } from '../../../core/store/auth/auth.actions';
import { AlertService } from '../../../shared/services/alert.service';
import { localStorageService } from '../../../configs/localStorage';
import { Title } from "@angular/platform-browser";
import { OperatorUtils } from '../../../core/utils/operators.util';
import { map } from 'rxjs/operators';
import { selectUserStatus } from '../../../core/store/auth/auth.selector';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})

export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  vm$: Observable<any>;
  isRememberMe: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private alertService: AlertService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Login');
    this.$login_getViewModel();
    this.$login_onCreateFormHandler();
    this.$login_getInforUserOnLocalStorage();
  }

  $login_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<any>({
      isLoading: this.store.pipe(select(selectUserStatus), map(status => status === 'loading'))
    });
  }

  $login_getInforUserOnLocalStorage() {
    let rememberInfor = localStorageService.getByKey('remember-user');
    let rememberMeCheckbox = document.getElementById("remember-me") as HTMLInputElement;
    if (rememberInfor) {
      let data = JSON.parse(rememberInfor);
      if (data?.isRememberUser && data?.userInfor?.Auth_Email && data?.userInfor?.Auth_Password) {
        rememberMeCheckbox.checked = true;
        this.isRememberMe = true;
        this.loginFormGroup.patchValue({
          Auth_Email: data?.userInfor?.Auth_Email || '',
          Auth_Password: data?.userInfor?.Auth_Password || '',
        });
      }
    } else {
      rememberMeCheckbox.checked = false;
    }
  }

  $login_onCreateFormHandler() {
    this.loginFormGroup = this.formBuilder.group({
      Auth_Email: ['', [Validators.required, Validators.email]],
      Auth_Password: ['', Validators.required],
    });
  }

  $login_onLoginHandler() {
    if (this.$login_validatorForm()) {
      if (this.isRememberMe) {
        let rememberInfor = {
          isRememberUser: true,
          userInfor: this.loginFormGroup.value
        }
        localStorageService.setLocalStorageByKey('remember-user', JSON.stringify(rememberInfor));
      } else {
        localStorageService.removeLocalStorageByKey('remember-user');
      }
      this.store.dispatch(loginUser({ userPayload: this.loginFormGroup.value }))
    }
  }

  $login_getValueForm() {
    return this.loginFormGroup.value;
  }

  $login_rememberMe(event) {
    this.isRememberMe = event.target.checked;
  }

  $login_validatorForm() {
    let valueForm = this.$login_getValueForm();
    if (!valueForm.Auth_Email) {
      this.alertService.errorAlert('Email is required !');
      return;
    }
    if (!valueForm.Auth_Password) {
      this.alertService.errorAlert('Password is required !');
      return;
    }
    return true;
  }
}
