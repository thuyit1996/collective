import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { Observable } from 'rxjs';
import { OperatorUtils } from '../../core/utils/operators.util';
import { selectIsRegister, selectRegisterPayload } from '../../core/store/auth/auth.selector';
import { ModalService } from '../../shared/services/modal.service';
import { ModalRegisterComponent } from '../auth/modal-register/modal-register.component';
import { takeUntil } from 'rxjs/operators';
import { clearIsRegister } from '../../core/store/auth/auth.actions';
import { getUsers } from '../../core/store/user/users.action';
import { AlertService } from '../../shared/services/alert.service';
import { getProjects, selectProject } from '../../core/store/project/project.actions';
import { projectSelector } from '../../core/store/project/project.selector';
import { DestroyableDirective } from '../../shared/directives/destroyable.directive';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  preserveWhitespaces: false
})
export class MainComponent extends DestroyableDirective implements OnInit, OnDestroy {
  vm$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private modalService: ModalService,
    private alertService: AlertService

  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(getUsers());
    this.$main_getProjectList();
    this.$main_getViewModel();
  }

  $main_getProjectList() {
    this.store.dispatch(getProjects());
  }

  $main_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<any>({
      isRegister: this.store.pipe(select(selectIsRegister)),
      registerPayload: this.store.pipe(select(selectRegisterPayload)),
      projectList: this.store.pipe(select(projectSelector)),
    });
    this.$main_isUserRegister();
  }

  $main_isUserRegister() {
    this.vm$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      // INFO : handler if user login first time 
      if (res.isRegister) {
        this.$main_addMoreUserInformation();
      }
      // INFO : select default the first project 
      if (res?.projectList?.length) {
        this.store.dispatch(selectProject({ projectId: res.projectList[0]?.pk_Project_ID || 0 }));
      }
    })
  }

  $main_addMoreUserInformation() {
    this.modalService.openModal(ModalRegisterComponent, { size: 'lg' }, { modalHeader: 'User profile' }).then(res => {
      this.store.dispatch(clearIsRegister());
      if (res === 'UPDATE-USER-SUCCESS') {
        this.alertService.successAlert('Update profile success !');
      }
    });
  }
}
