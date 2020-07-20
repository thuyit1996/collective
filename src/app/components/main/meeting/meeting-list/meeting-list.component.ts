import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../core/store/app.state';
import { Store, select } from '@ngrx/store';
import { getMeetings } from '../../../../core/store/meeting/meeting.actions';
import { Observable } from 'rxjs';
import { Meeting } from '../../../../core/models/Meeting';
import { OperatorUtils } from '../../../../core/utils/operators.util';
import { meetingsSelector, meetingStatusSelector, meetingsTypeLoadingSelector } from '../../../../core/store/meeting/meeting.selector';
import { projectCurrentItemSelector } from '../../../../core/store/project/project.selector';
import { map } from 'rxjs/operators';
import { Title } from "@angular/platform-browser";
import { ModalService } from '../../../../shared/services/modal.service';
import { MeetingService } from '../../../../core/services/meeting.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { AddMeetingComponent } from '../add-meeting/add-meeting.component';
import { Router, NavigationExtras } from '@angular/router';
import { getColorStatus } from '../../../../utils/util';
interface MeetingListVm {
  meetings: Meeting[];
  isLoading: boolean;
  typeLoading: boolean;
  projectSelected: any;
}
@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {
  vm$: Observable<MeetingListVm>;
  MeetingTableTitle = 'Meeting List';
  columnOption = [
    { columnName: 'Transcript', columnId: 'transcript' },
    { columnName: 'Date', columnId: 'date' },
    { columnName: 'Time', columnId: 'time' },
    { columnName: 'Type', columnId: 'type' },
    { columnName: 'Status', columnId: 'status' },
    { columnName: 'Options', columnId: 'option' },
  ];
  constructor(
    private store: Store<AppState>,
    private title: Title,
    private modalService: ModalService,
    private meetingService: MeetingService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.title.setTitle('Meeting');
    this.$meetingList_getMeetingListHandler();
    this.$meetingList_getViewModel();
  }

  $meetingList_getMeetingListHandler() {
    this.store.dispatch(getMeetings());
  }

  $meetingList_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<MeetingListVm>({
      meetings: this.store.pipe(select(meetingsSelector)),
      isLoading: this.store.pipe(select(meetingStatusSelector), map(status => status === 'loading')),
      typeLoading: this.store.pipe(select(meetingsTypeLoadingSelector), map(loading => loading === 'list-loading')),
      projectSelected: this.store.pipe(select(projectCurrentItemSelector), map(project => project?.pk_Project_ID))
    });
  }

  $meetingList_filterMeetingByProject(meetingList, projectId) {
    return (meetingList || []).filter(item => item?.fk_Project_ID === projectId);
  }

  $meetingList_getColorStatus(status) {
    return getColorStatus(status);
  }

  $meetingList_deleteMeeting(meetingId) {
    this.meetingService.deleteMeetingById(meetingId).subscribe(res => {
      this.alertService.successAlert('Delete meeting success !');
      this.store.dispatch(getMeetings());
    }, err => {
      this.alertService.errorAlert(err?.error || 'Delete meeting failed !');
    });
  }

  $meetingList_editMeeting(meetingId: number, enterpriseId) {
    this.modalService.openModal(AddMeetingComponent, { size: 'lg' },
      { modalHeader: 'Edit meeting', actionType: 'Edit', meetingId, enterpriseId }).then(res => {
        if (res === 'ACTION_MODAL_SUCCESS') {
          this.$meetingList_getMeetingListHandler();
        }
      });
  }

  $meetingList_navigateToMeetingMinutes(id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "id": id
      }
    }
    this.router.navigate(['/main/meeting-minutes'], navigationExtras);
  }

  $meetingList_trackById(index: number, item) {
    return item?.pk_Meeting_ID;
  }
}
