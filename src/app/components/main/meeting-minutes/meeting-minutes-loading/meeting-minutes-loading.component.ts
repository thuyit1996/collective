import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-meeting-minutes-loading',
  template: `
    <div  *ngFor="let it of ghosts" class='user' fxFlex="50" fxFlex.xs="100" >
      <div class="avatar"></div>
      <div class="lines">
        <h2></h2>
        <h3></h3>
      </div>
    </div> 
  `,
  styleUrls: ['./meeting-minutes-loading.component.scss']
})
export class MeetingMinutesLoadingComponent implements OnInit {
  @Input() ghosts: any[];
  constructor() { }

  ngOnInit() {
  }

}
