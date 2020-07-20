import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main.routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ModalRegisterComponent } from '../auth/modal-register/modal-register.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
  ],
  declarations: [
    MainComponent,
    ModalRegisterComponent,
  ],
  entryComponents: [
    ModalRegisterComponent,
  ],
  providers: [
  ]
})
export class MainModule { }
