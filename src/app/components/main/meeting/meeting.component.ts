import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { AppState } from '../../../core/store/app.state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OperatorUtils } from '../../../core/utils/operators.util';
import { selectIsCreateItem, selectModule } from '../../../core/store/module/module.selector';
import { MEETING_TYPE } from '../../../configs/module-type';
import { setModule } from '../../../core/store/module/module.actions';

interface interfaceVm {
  isCreateItem: boolean,
  module: string,
}
@Component({
  selector: 'app-meeting',
  template: `
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class MeetingComponent implements OnInit {
  vm$: Observable<interfaceVm>;
  constructor(
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.$meeting_setModule();
    this.$meeting_getViewModel();
  }

  $meeting_setModule() {
    this.store.dispatch(setModule({ moduleName: MEETING_TYPE }));
  }

  $meeting_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<interfaceVm>({
      isCreateItem: this.store.pipe(select(selectIsCreateItem)),
      module: this.store.pipe(select(selectModule)),
    })
  }

}