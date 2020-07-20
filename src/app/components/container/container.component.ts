import { Component, OnInit, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { setIsCreateItem } from '../../core/store/module/module.actions';
import { Observable } from 'rxjs';
import { OperatorUtils } from '../../core/utils/operators.util';
import { selectModule } from '../../core/store/module/module.selector';
import { takeUntil, map } from 'rxjs/operators';
import { PROJECT_TYPE, MEETING_TYPE, MEETING_MINUTES_TYPE } from '../../configs/module-type';
import { ModalService } from '../../shared/services/modal.service';
import { TranscriberMeetingComponent } from '../../shared/components/transcriber-meeting/transcriber-meeting.component';
import { getMeetings } from '../../core/store/meeting/meeting.actions';
import { projectCurrentItemSelector } from '../../core/store/project/project.selector';
import { AlertService } from '../../shared/services/alert.service';
import { DestroyableDirective } from '../../shared/directives/destroyable.directive';
interface interfaceVm {
  module: string,
  selectProject: number,
}
@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  preserveWhitespaces: false
})
export class ContainerComponent extends DestroyableDirective implements OnInit {
  vm$: Observable<interfaceVm>;
  moduleName: string;
  selectedProject = 0;
  backgroundContainer: HTMLElement;
  constructor(
    private store: Store<AppState>,
    private elRef: ElementRef,
    private modalService: ModalService,
    private alertService: AlertService
  ) {
    super();
  }

  ngOnInit() {
    this.backgroundContainer = this.elRef.nativeElement.querySelector('.main-content');
    this.$container_getViewModel();
  }

  $container_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<interfaceVm>({
      module: this.store.pipe(select(selectModule)),
      selectProject: this.store.pipe(select(projectCurrentItemSelector), map(val => val?.pk_Project_ID as number))
    });
    this.$container_getModuleName();
  }

  $container_getModuleName() {
    this.vm$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.moduleName = res.module;
      this.selectedProject = res.selectProject;
      this.$container_addBackgroundGrey();
    })
  }

  $container_addItem() {
    if (!this.selectedProject && this.moduleName == MEETING_TYPE) {
      this.alertService.warningAlert('Please select project !');
      return;
    }
    this.store.dispatch(setIsCreateItem());
    if (this.moduleName != PROJECT_TYPE) {
      let buttonElm = this.elRef.nativeElement.querySelector('.main-content__trans-button');
      buttonElm.classList.toggle('active');
      if (buttonElm.classList.contains('active')) {
        if (this.selectedProject) {
          this.$container_actionModalTranscriberHandler(buttonElm);
        }
      }
    }
  }

  $container_actionModalTranscriberHandler(el) {
    this.modalService.openModal(TranscriberMeetingComponent, { size: 'xl', windowClass: 'transcriber-tool-meeting' }, { modalHeader: 'Add meeting', actionType: 'Add' }).then(res => {
      el.classList.remove('active');
      switch (res) {
        case 'ACTION_MEETING_SUCCESS': {
          this.store.dispatch(getMeetings());
          this.store.dispatch(setIsCreateItem());
          break;
        }
        default: {
          break;
        }
      }
    })
  }

  $container_addBackgroundGrey() {
    if (this.moduleName === MEETING_MINUTES_TYPE) {
      this.backgroundContainer.classList.add('background-grey');
    } else {
      this.backgroundContainer.classList.remove('background-grey');
    }
  }
}
