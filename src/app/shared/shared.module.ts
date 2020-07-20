import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../components/header/header.component';
import { IconsModule } from './modules/icon.module';
import { ContainerComponent } from '../components/container/container.component';
import { RouterModule } from '@angular/router';
import { AlertService } from './services/alert.service';
import { CallApiService } from './services/call-api.service';
import { ModalComponent } from './components/modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from './services/modal.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoadingComponent } from './components/loading/loading.component';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';
import { UserService } from '../core/services/user.service';
import { CustomNamePipe } from './pipes/custom-name.pipe';
import { TranscriberMeetingComponent } from './components/transcriber-meeting/transcriber-meeting.component';
import { TranscriberMeetingGetUsersComponent } from './components/transcriber-meeting-get-users/transcriber-meeting-get-users.component';
import { TransFormType } from './pipes/transform-type.pipe';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { HttpConfigInterceptor } from './httpconfig/httpconfig.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TransFormIcon } from './pipes/transform-icon.pipe';
import { DestroyableDirective } from './directives/destroyable.directive';
const component = [
  HeaderComponent,
  ContainerComponent,
  ModalComponent,
  LoadingComponent,
  TruncateTextPipe,
  CustomNamePipe,
  TransFormType,
  TransFormIcon,
  TranscriberMeetingComponent,
  TranscriberMeetingGetUsersComponent,
]
const directive = [
  DestroyableDirective,
]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    IconsModule,
    RouterModule,
    DragDropModule,
    LoadingBarHttpClientModule,
    LoadingBarModule
  ],
  declarations: [
    ...component,
    ...directive
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    IconsModule,
    DragDropModule,
    LoadingBarHttpClientModule,
    LoadingBarModule,
    ...component
  ],
  providers: [
    AlertService,
    CallApiService,
    ModalService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
  ],
  entryComponents: [
    ModalComponent,
    TranscriberMeetingComponent,
    TranscriberMeetingGetUsersComponent,

  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    }
  }
}