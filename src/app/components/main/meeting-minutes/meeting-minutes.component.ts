import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { defer, of, Observable, fromEvent, timer } from 'rxjs';
import { pluck, tap, switchMap, map, takeUntil } from 'rxjs/operators';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { AppState } from '../../../core/store/app.state';
import { setModule } from '../../../core/store/module/module.actions';
import { MEETING_MINUTES_TYPE } from '../../../configs/module-type';
import { TranscriberMeetingService } from '../../../core/services/transcriber-meeting.service';
import { MeetingTranscriptItem } from '../../../core/models/MeetingTranscriptItem';
import { getTranscriptByMeetingId, getTranscriptByIndex } from './meeting-minutes.hepler';
import { AlertService } from '../../../shared/services/alert.service';
import { MeetingMinuteService } from '../../../core/services/meeting-minute.service';
import { User } from '../../../core/models/User';
import { OperatorUtils } from '../../../core/utils/operators.util';
import { getUsersList } from '../../../core/store/user/users.selector';
import { DestroyableDirective } from '../../../shared/directives/destroyable.directive';
import { findInitialNameAndAvatarColor, customName } from '../../../utils/util';
import { getUserProfile } from '../../../core/store/user/users.action';
import { MeetingService } from '../../../core/services/meeting.service';
import { getColorStatus } from '../../../utils/util';
import { localStorageService } from '../../../configs/localStorage';
import { ModalService } from 'src/app/shared/services/modal.service';
import { TranscriberMeetingGetUsersComponent } from '../../../shared/components/transcriber-meeting-get-users/transcriber-meeting-get-users.component';
import { Meeting } from '../../../core/models/Meeting';

interface interfaceVm {
  userList: User[],
}

interface userWithFallBackName extends User {
  fallbackName: string;
}
@Component({
  selector: 'app-meeting-minutes',
  templateUrl: './meeting-minutes.component.html',
  styleUrls: ['./meeting-minutes.component.scss']
})
export class MeetingMinutesComponent extends DestroyableDirective implements OnInit, AfterViewInit {

  @ViewChildren("dragItem") dragItem: QueryList<ElementRef>;
  editorValue: string = '';
  meetingId: number;
  meetingTranscriberList: MeetingTranscriptItem[] = [];
  ghosts = [];
  isLoading: boolean;
  vm$: Observable<interfaceVm>;
  userList: User[];
  seletedMeetingTranscript: MeetingTranscriptItem | undefined;
  userProfile: User;
  meetingDetail: Meeting;
  ckeditorElement: HTMLElement;
  attendeesList: userWithFallBackName[] = [];
  apologisesList: userWithFallBackName[] = [];
  constructor(
    private title: Title,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private meetingTransriptService: TranscriberMeetingService,
    private meetingMinuteService: MeetingMinuteService,
    private alertService: AlertService,
    private meetingService: MeetingService,
    private elRef: ElementRef,
    private modalService: ModalService
  ) {
    super();
  }

  ngOnInit() {
    this.title.setTitle('Meeting minutes');
    this.ghosts = new Array(8);
    this.$meetingMinutes_getViewModel();
    this.store.dispatch(getUserProfile());
    this.$meetingMinutes_getAllMeetingTranscript();
    this.$meetingMinutes_setModule();
    timer(2000).subscribe(() => this.ckeditorElement = this.elRef.nativeElement.querySelector('.minutes-comment-content .cke_reset'));
  }

  ngAfterViewInit() {
    this.dragItem.toArray().forEach(e => {
      fromEvent(e.nativeElement, 'mousedown').subscribe(() => this.ckeditorElement.style.pointerEvents = 'none');
    })
  }

  $meetingMinutes_getAllMeetingTranscript() {
    this.route.queryParams.pipe(
      pluck('id'),
      map(id => Number(id)),
      tap(id => {
        this.isLoading = true;
        this.meetingId = id;
      }),
      switchMap(id => {
        let a = this.meetingService.getMeetingById(id);
        let b = this.meetingTransriptService.getAllTransriberMeeting();
        let c = this.meetingService.getUserOfMeeting(id);
        return OperatorUtils.forkJoinCustom([a, b, c]);
      }))
      .subscribe(res => {
        this.meetingDetail = res[0] ?? {};
        this.meetingTranscriberList = getTranscriptByMeetingId(res[1] || [], this.meetingId);
        this.isLoading = false;
        timer(1000).subscribe(() => this.ngAfterViewInit());
        this.attendeesList = res[2] || [];
        this.attendeesList.forEach(item => {
          item.fallbackName = customName({ name: item?.User_Initials, email: item?.User_Email });
        })
      });
  }

  $meetingMinutes_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<interfaceVm>({
      userList: this.store.pipe(select(getUsersList)),
    });
    this.vm$.pipe(
      map(res => res.userList),
      tap(userList => this.userProfile = (userList || []).find(item => item.User_Email === localStorageService.getByKey('user-name')) ?? {}),
      takeUntil(this.destroy$),
    ).subscribe((res) => {
      this.userList = res || []
    });
  }

  $meetingMinutes_setModule() {
    this.store.dispatch(setModule({ moduleName: MEETING_MINUTES_TYPE }));
  }

  $meetingMinutes_onDropUserToCkditor(event) {
    this.ckeditorElement.style.pointerEvents = 'unset';
    let transriptIndex = event.previousIndex;
    let meetingTranscript = getTranscriptByIndex(this.meetingTranscriberList, transriptIndex);
    this.seletedMeetingTranscript = meetingTranscript;
    this.editorValue = meetingTranscript?.MeetingTranscriptItem_Note || '';
  }

  $meetingMinutes_cancelDrag() {
    this.ckeditorElement.style.pointerEvents = 'unset';
  }

  $meetingMinutes_getUser(userId) {
    return findInitialNameAndAvatarColor(this.userList, userId)
  }

  $meetingMinutes_saveMeetingMinutes() {
    defer(() => {
      return this.editorValue ? of(this.editorValue) : of(null)
    }).subscribe(res => {
      if (!res) this.alertService.errorAlert('Meeting minute content is required !');
      else this.$meetingMinutes_saveMeetingMinutesHandler();
    })
  }

  $meetingMinutes_addUser() {
    this.modalService.openModal(TranscriberMeetingGetUsersComponent,
      { size: 'lg', windowClass: 'users-modal' },
      {
        modalHeader: 'Select Users Meeting',
        attendeesIdList: [...this.attendeesList, ...this.apologisesList].map(item => item.pk_User_ID)
      }).then(res => {
        if (res !== 'close') {
          this.attendeesList = [...this.attendeesList, ...(res || [])];
        }
      });
  }

  $meetingMinutes_getColorStatus(status) {
    return getColorStatus(status);
  }

  $meetingMinutes_saveMeetingMinutesHandler() {
    let payload = {
      fk_User_ID: this.seletedMeetingTranscript ? this.seletedMeetingTranscript.fk_User_ID : this.userProfile.pk_User_ID,
      fk_Meeting_ID: this.meetingId,
      MeetingMinuteItem_Notes: this.editorValue,
    }
    if (this.seletedMeetingTranscript) {
      (payload as any).fk_MeetingTranscriptItem_ID = this.seletedMeetingTranscript.pk_MeetingTranscriptItem_ID;
    }
    this.meetingMinuteService.addMeetingMinute(payload)
      .subscribe(res => {
        this.alertService.successAlert(res);
        this.editorValue = '';
        // INFO : reset select meeting transript
        this.seletedMeetingTranscript = undefined;
      });
  }

  $meetingMinutes_onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex, event.currentIndex);
    }
  }
}

