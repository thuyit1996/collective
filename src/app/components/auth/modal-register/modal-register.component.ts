import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperatorUtils } from '../../../core/utils/operators.util';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';
import { getUsersList } from '../../../core/store/user/users.selector';
import { takeUntil } from 'rxjs/operators';
import { localStorageService } from '../../../configs/localStorage';
import { UserService } from '../../../core/services/user.service';
import { getUsers } from '../../../core/store/user/users.action';
import { countryList, timezoneList, phoneCodeList } from './register-dropdown-list';
import { DestroyableDirective } from '../../../shared/directives/destroyable.directive';

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.component.html',
  styleUrls: ['./modal-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ModalRegisterComponent extends DestroyableDirective implements OnInit {
  vm$: Observable<any>;
  modalHeader: string;
  isModalOpen: boolean = true;
  modalRegisterFormGroup: FormGroup;
  userInformation: any;
  countryList = [];
  timezoneList = [];
  phoneCodeList = [];
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit() {
    this.countryList = countryList;
    this.timezoneList = timezoneList;
    this.phoneCodeList = phoneCodeList;
    this.$modalRegister_onCreateFormHandler();
    this.$modalRegister_getViewModel();
  }

  $modalRegister_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<any>({
      usersList: this.store.pipe(select(getUsersList)),
    });
    this.$modalRegister_findProfile();
  }

  $modalRegister_findProfile() {
    let userName = localStorageService.getByKey('user-name') || '';
    let usersData = [];
    this.vm$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      usersData = data.usersList.filter(item => item.User_Email === userName);
      if (usersData?.length) {
        this.userInformation = usersData[0];
        this.userInformation.fallBackName = this.$modalRegister_customName(usersData[0]?.User_Initials, usersData[0]?.User_Email);
        this.modalRegisterFormGroup.patchValue({
          ...usersData[0]
        })
      }
    });
  }

  $modalRegister_customName(name, email) {
    return !name ? (email?.charAt(0) + email?.charAt(1))?.toUpperCase() : name;
  }

  $modalRegister_onCreateFormHandler() {
    this.modalRegisterFormGroup = this.formBuilder.group({
      User_FirstName: ['', [Validators.required]],
      User_SecondName: ['', [Validators.required]],
      User_StreetAddress: ['', [Validators.required]],
      User_StreetAddress2: ['', [Validators.required]],
      User_StreetAddress3: ['', [Validators.required]],
      User_City: ['', [Validators.required]],
      User_Postcode: ['', [Validators.required]],
      User_Region: ['', [Validators.required]],
      User_Country: ['', [Validators.required]],
      User_TimeZone: ['', [Validators.required]],
      User_PhoneNumberCountryCode: ['', [Validators.required]],
      User_PhoneNumber: ['', [Validators.required]],
      User_Email: ['', [Validators.email]],
    });
  }

  $modalRegister_closeModal() {
    this.activeModal.close();
    this.isModalOpen = false;
  }

  $modalRegister_onRegisterHandler() {
    this.userInformation.User_AccessLevel = 1;
    this.userInformation.User_Status = 1;
    let valueForm = Object.assign(this.userInformation, { ...this.modalRegisterFormGroup.value });
    delete valueForm?.fallBackName;
    this.userService.updateUser(valueForm).subscribe(data => {
      this.store.dispatch(getUsers());
      this.activeModal.close('UPDATE-USER-SUCCESS');
    })
  }

}
