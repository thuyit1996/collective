import { Component, OnInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorUtils } from '../../core/utils/operators.util';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { logout } from '../../core/store/auth/auth.actions';
import { ModalService } from '../../shared/services/modal.service';
import { ModalRegisterComponent } from '../auth/modal-register/modal-register.component';
import { AlertService } from '../../shared/services/alert.service';
import { getUsersList } from '../../core/store/user/users.selector';
import { localStorageService } from '../../configs/localStorage';
import { takeUntil, map } from 'rxjs/operators';
import { selectModule } from '../../core/store/module/module.selector';
import { projectSelector, projectCurrentItemSelector } from '../../core/store/project/project.selector';
import { selectProject } from '../../core/store/project/project.actions';
import { DestroyableDirective } from '../../shared/directives/destroyable.directive';

interface interfaceVm {
  usersList: any, projectList: any, module: string, selectProject: any,
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  preserveWhitespaces: false
})
export class HeaderComponent extends DestroyableDirective implements OnInit {
  vm$: Observable<interfaceVm>;
  userInformation: any = {};
  menuList: any[] = [];
  constructor(
    private store: Store<AppState>,
    private modalService: ModalService,
    private alertService: AlertService,
    private elRef: ElementRef
  ) {
    super();
  }

  ngOnInit() {
    this.$header_getViewModel();
  }

  $header_setMenuList(module) {
    this.menuList = [
      { url: '/main/meeting/meeting-list', name: 'Meeting', image: './assets/img/meeting.svg', title: 'meeting' },
      { url: '/main/project/project-list', name: 'Project', image: './assets/img/project.svg', title: 'project' },
      { url: '#', name: 'Report', image: './assets/img/report.svg' },
      { url: '#', name: 'Teams', image: './assets/img/team.svg' },
    ]
  }

  $header_getProfile() {
    let userName = localStorageService.getByKey('user-name');
    this.vm$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (userName) {
        this.userInformation = (res?.usersList || []).find(item => item.User_Email === userName);
        if (this.userInformation) {
          this.userInformation.fallBackName = this.$header_customName(this.userInformation?.User_Initials, this.userInformation?.User_Email);
        }
      }
      this.$header_setMenuList(res.module);
    })
  }

  $header_customName(name, email) {
    return !name ? (email?.charAt(0) + email?.charAt(1))?.toUpperCase() : name;
  }

  $header_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<interfaceVm>({
      usersList: this.store.pipe(select(getUsersList)),
      projectList: this.store.pipe(select(projectSelector)),
      module: this.store.pipe(select(selectModule)),
      selectProject: this.store.pipe(select(projectCurrentItemSelector), map(val => {
        return {
          projectId: val?.pk_Project_ID,
          projectName: val?.Project_Name
        }
      }))
    })
    this.$header_getProfile();
  }

  $header_addInfomation(event) {
    event.preventDefault();
    this.modalService.openModal(ModalRegisterComponent, { size: 'lg' }, { modalHeader: 'User profile' }).then(res => {
      if (res === 'UPDATE-USER-SUCCESS') {
        this.alertService.successAlert('Update profile success !');
      }
    });
  }

  $header_hiddenMenu() {
    this.$header_closeDropDown('.header__option__item--menu .dropdown-menu');
  }

  $header_selectProject(projectId, projectName) {
    this.$header_closeDropDown('.dropdown-menu-project');
    this.store.dispatch(selectProject({ projectId }));
  }

  $header_closeDropDown(className) {
    const dropdownMenu = this.elRef.nativeElement.querySelector(className);
    dropdownMenu.classList.remove('show');
  }

  $header_onLogout(event) {
    event.preventDefault();
    this.store.dispatch(logout());
  }

}
