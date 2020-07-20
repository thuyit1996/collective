import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppState } from '../../../core/store/app.state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OperatorUtils } from '../../../core/utils/operators.util';
import { selectIsCreateItem, selectModule } from '../../../core/store/module/module.selector';
import { takeUntil } from 'rxjs/operators';
import { PROJECT_TYPE } from '../../../configs/module-type';
import { ModalService } from '../../../shared/services/modal.service';
import { setModule, setIsCreateItem } from '../../../core/store/module/module.actions';
import { AddProjectComponent } from './add-project/add-project.component';
import { getProjects } from '../../../core/store/project/project.actions';
import { DestroyableDirective } from '../../../shared/directives/destroyable.directive';

interface interfaceVm {
  isCreateItem: boolean,
  module: string,
}
@Component({
  selector: 'app-project',
  template: `
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ProjectComponent extends DestroyableDirective implements OnInit {
  vm$: Observable<interfaceVm>;
  constructor(
    private store: Store<AppState>,
    private modalService: ModalService,
  ) {
    super();
  }

  ngOnInit() {
    this.$project_setModule();
    this.$project_getViewModel();
  }

  $project_setModule() {
    this.store.dispatch(setModule({ moduleName: PROJECT_TYPE }));
  }

  $project_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<interfaceVm>({
      isCreateItem: this.store.pipe(select(selectIsCreateItem)),
      module: this.store.pipe(select(selectModule)),
    });
    this.$project_checkOpenModal();
  }

  $project_checkOpenModal() {
    this.vm$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.isCreateItem && res.module === PROJECT_TYPE) {
        this.$project_openModalAddProjectHandler();
      }
    });
  }

  $project_openModalAddProjectHandler() {
    this.modalService.openModal(AddProjectComponent, { size: 'lg' }, { modalHeader: 'Add project', actionType: 'Add' }).then(res => {
      this.store.dispatch(setIsCreateItem());
      if (res === 'ACTION_MODAL_SUCCESS') {
        this.store.dispatch(getProjects());
      }
    });
  }

}
