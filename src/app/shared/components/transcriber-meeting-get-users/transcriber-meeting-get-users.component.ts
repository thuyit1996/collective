import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../app/core/store/app.state';
import { getUsersList } from '../../../../app/core/store/user/users.selector';
import { takeUntil } from 'rxjs/operators';
import { OperatorUtils } from '../../../../app/core/utils/operators.util';
import { User } from '../../../core/models/User';
import { DestroyableDirective } from '../../directives/destroyable.directive';

interface userWithIsChecked extends User {
  isChecked?: boolean;
  fallbackName?: string;
}

@Component({
  selector: 'app-transcriber-meeting-get-users',
  templateUrl: './transcriber-meeting-get-users.component.html',
  styleUrls: ['./transcriber-meeting-get-users.component.scss']
})
export class TranscriberMeetingGetUsersComponent extends DestroyableDirective implements OnInit {
  isModalOpen = true;
  modalHeader: string;
  usersList: userWithIsChecked[] = [];
  usersListChosen: userWithIsChecked[] = [];
  buttonElm: HTMLElement;
  attendeesIdList: number[];
  vm$: Observable<any>;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    this.$usersList_getViewModel();
    this.$usersList_removeActiveTransButton();
  }

  $usersList_removeActiveTransButton() {
    this.buttonElm = document.querySelector('.main-content__trans-button');
    this.buttonElm.classList.remove('active');
  }

  $usersList_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<any>({
      usersList: this.store.pipe(select(getUsersList)),
    });
    this.$usersList_getUsers();
    this.$usersList_setUserCheckUserSelect();
  }

  $usersList_getUsers() {
    this.vm$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.usersList = res?.usersList;
      this.usersList.forEach(user => user.fallbackName = this.$usersList_addFallBackUserName(user));
    });
  }

  $usersList_setUserCheckUserSelect() {
    const listUserNoSelect = this.usersList.filter(user => !this.attendeesIdList.includes(user.pk_User_ID));
    listUserNoSelect.map(user => user.isChecked = false);
    this.usersList = [...listUserNoSelect];
  }

  $usersList_addFallBackUserName(data) {
    return !data?.User_Initials ? (data?.User_Email?.charAt(0) + data?.User_Email?.charAt(1))?.toUpperCase() : data.User_Initials;
  }

  $usersList_changeUser(index) {
    this.usersList[index].isChecked = !this.usersList[index]?.isChecked;
    if (this.usersList[index].isChecked) {
      this.usersListChosen.push(this.usersList[index]);
    } else {
      this.usersListChosen.forEach((item, ind) => {
        if (item.pk_User_ID === this.usersList[index].pk_User_ID) {
          this.usersListChosen.splice(ind, 1);
        }
      });
    }
  }

  $usersList_submitListUsersSelected() {
    this.$usersList_closeModal(this.usersListChosen);
  }

  $usersList_closeModal(type) {
    this.activeModal.close(type);
    this.isModalOpen = false;
  }

  ngOnDestroy() {
    this.buttonElm.classList.add('active');
  }

}
