import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
const FADE_IN_TIMEOUT = 500;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  preserveWhitespaces: false,
  animations: [
    trigger('fade', [
      transition('void => active', [
        style({ opacity: 0 }),
        animate(FADE_IN_TIMEOUT, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate(FADE_IN_TIMEOUT, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {
  @Input('isModalOpen') isModalOpen: boolean = true;

  ngOnInit() {
  }
}
