import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { OperatorUtils } from '../../../core/utils/operators.util';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';
import { selectIsCreateItem } from '../../../core/store/module/module.selector';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { projectCurrentItemSelector } from '../../../core/store/project/project.selector';
import { MeetingService } from '../../../core/services/meeting.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Meeting } from '../../../core/models/Meeting';
import { User } from '../../../core/models/User';
import { ModalService } from '../../services/modal.service';
import { TranscriberMeetingService } from '../../../core/services/transcriber-meeting.service';
import { userProfileSelector, getUsersList } from '../../../core/store/user/users.selector';
import { getUserProfile } from '../../../core/store/user/users.action';
import {
  meetingDto,
  transcriberMeetingItemDto,
  findTranscriber,
  setPositionTranscriberMeeting,
  scrollBottom, isAuthorized
} from './transcriber-meeting.helper';
import { randomId, findUserName, customName } from '../../../utils/util';
import { MeetingTranscriptItem } from '../../../core/models/MeetingTranscriptItem';
import { TranscriberMeetingGetUsersComponent } from '../transcriber-meeting-get-users/transcriber-meeting-get-users.component';
import { ProjectService } from 'src/app/core/services/project.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { updateMeetingList, getMeetings } from '../../../core/store/meeting/meeting.actions';
import { DestroyableDirective } from '../../directives/destroyable.directive';
interface interfaceVm {
  isCreateItem: boolean,
  selectProject: number;
  usersList: User[],
}

interface userWithFallBackName extends User {
  fallbackName: string;
}
@Component({
  selector: 'app-transcriber-meeting',
  templateUrl: './transcriber-meeting.component.html',
  styleUrls: ['./transcriber-meeting.component.scss']
})
export class TranscriberMeetingComponent extends DestroyableDirective implements OnInit {
  vm$: Observable<interfaceVm>;
  meetingSelected: Meeting;
  selectedProjectID: number = 0;
  relativeMeetingList: Meeting[] = [];
  attendeesList: userWithFallBackName[] = [];
  apologisesList: userWithFallBackName[] = [];
  transcriberMeetingNote: string = '';
  userProfile: User;
  usersList: User[] = [];
  listAllMeetingTranscriber: MeetingTranscriptItem[] = [];
  listTranscriberByMeeting: MeetingTranscriptItem[] = [];
  contentTranscriber: string = '';
  meetingTypes = [
    { name: '', isActive: false },
    { name: 'video', isActive: false },
    { name: 'phone-call', isActive: false },
    { name: 'users', isActive: false },
  ];
  meetingTypeChosen = 1;
  isCollapseApologies: boolean = true;
  isCollapseAttendees: boolean = true;
  isDisabledButton: boolean = false;
  constructor(
    private store: Store<AppState>,
    private activeModel: NgbActiveModal,
    private meetingService: MeetingService,
    private projectService: ProjectService,
    private alertService: AlertService,
    private modalService: ModalService,
    private transcriberMeetingService: TranscriberMeetingService
  ) {
    super();
  }

  ngOnInit() {
    this.$transcriberMeeting_getUserProfile();
    this.$transcriberMeeting_getViewModel();
    this.$transcriberMeeting_getAttendessForProject();
    this.$transcriberMeeting_getAllTransriberMeetingItem();
  }

  $transcriberMeeting_getUserProfile() {
    this.store.dispatch(getUserProfile());
  }

  $transcriberMeeting_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<interfaceVm>({
      isCreateItem: this.store.pipe(select(selectIsCreateItem)),
      selectProject: this.store.pipe(select(projectCurrentItemSelector), map(val => val?.pk_Project_ID as number)),
      usersList: this.store.pipe(select(getUsersList))
    });
    this.vm$.pipe(
      withLatestFrom(this.store.pipe(select(userProfileSelector))),
      takeUntil(this.destroy$))
      .subscribe(([vm, profile]) => {
        if (!vm.isCreateItem) {
          this.activeModel.close();
        } else {
          this.selectedProjectID = vm.selectProject;
          this.$transcriberMeeting_getMeetingByProject();
        }
        this.usersList = vm.usersList;
        this.userProfile = profile ?? {};
      });
  }

  $transcriberMeeting_getAllTransriberMeetingItem(getTranscriberAgain: boolean = false) {
    this.transcriberMeetingService.getAllTransriberMeeting().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.listAllMeetingTranscriber = setPositionTranscriberMeeting(res || [], this.userProfile.pk_User_ID);
      if (getTranscriberAgain) {
        this.$transcriberMeeting_findTranscriberByMeetingId(this.meetingSelected?.pk_Meeting_ID);
      }
    });
  }

  $transcriberMeeting_getMeetingByProject(selectLastRelativeMeeting?: boolean) {
    this.meetingService.getMeetingByProjectId(this.selectedProjectID).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.relativeMeetingList = res || [];
      if (selectLastRelativeMeeting) {
        this.meetingSelected = this.relativeMeetingList?.[this.relativeMeetingList.length - 1];
        this.$transcriberMeeting_getAllTransriberMeetingItem(true);
      }
    });
  }

  $transcriberMeeting_getAttendessForProject() {
    this.projectService.getUserOfProject(this.selectedProjectID).subscribe(res => {
      this.attendeesList = res || [];
      this.attendeesList.forEach(item => {
        item.fallbackName = customName({ name: item?.User_Initials, email: item?.User_Email });
      })
    });
  }

  $transcriberMeeting_getAttendessForMeeting() {
    this.meetingService.getUserOfMeeting(this.meetingSelected?.pk_Meeting_ID).subscribe(res => {
      this.attendeesList = res || [];
      this.attendeesList.forEach(item => {
        item.fallbackName = customName({ name: item?.User_Initials, email: item?.User_Email });
      })
    });
  }



  $transcriberMeeting_selectMeeting(meetingId) {
    this.meetingSelected = this.relativeMeetingList.find(item => item.pk_Meeting_ID === meetingId) ?? {} as Meeting;
    this.$transcriberMeeting_activeMeetingType(+this.meetingSelected.fk_Meeting_Type_ID - 1);
    this.$transcriberMeeting_findTranscriberByMeetingId(this.meetingSelected?.pk_Meeting_ID);
    this.$transcriberMeeting_getAttendessForMeeting();
  }

  $transcriberMeeting_findTranscriberByMeetingId(meetingId) {
    this.listTranscriberByMeeting = findTranscriber(this.listAllMeetingTranscriber, meetingId);
    this.$transcriberMeeting_scrollBottom();
  }

  $transcriberMeeting_findUser(userId) {
    return findUserName(this.usersList, userId);
  }

  $transcriberMeeting_saveMeeting() {
    if (this.meetingSelected) {
      this.$transcriberMeeting_updateMeeting();
    } else {
      this.$transcriberMeeting_addMeeting();
    }
  }

  $transcriberMeeting_updateMeeting() {
    const payload = Object.assign({}, this.meetingSelected, {
      MeetingAttendees: this.attendeesList,
      fk_Meeting_Type_ID: this.meetingTypeChosen
    });
    this.meetingService.updateMeeting(payload).subscribe(_ => {
      this.alertService.successAlert('Update meeting success !');
      this.store.dispatch(getMeetings());
      // INFO: update type , attendees
      this.relativeMeetingList.forEach(item => {
        if (item.pk_Meeting_ID === this.meetingSelected.pk_Meeting_ID) {
          item.fk_Meeting_Type_ID = this.meetingTypeChosen;
        }
      })
    });
  }

  $transcriberMeeting_addMeeting() {
    let payload = meetingDto({
      selectedProjectID: this.selectedProjectID,
      MeetingAttendees: this.attendeesList, MeetingType: this.meetingTypeChosen
    });
    this.meetingService.addMeeting(payload).subscribe(data => {
      this.alertService.successAlert('Add meeting success !');
      this.store.dispatch(getMeetings());
      this.$transcriberMeeting_getMeetingByProject(true);
      this.attendeesList = [];
    });
  }

  $transcriberMeeting_addTranscriberMeeting() {
    if (this.transcriberMeetingNote && !this.meetingSelected?.pk_Meeting_ID) {
      this.$transcriberMeeting_addMeetingAndAddTranscriberMeeting();
    }
    if (this.meetingSelected?.pk_Meeting_ID && this.transcriberMeetingNote) {
      let payload = transcriberMeetingItemDto({
        fk_User_ID: this.userProfile?.pk_User_ID || 0,
        fk_Meeting_ID: this.meetingSelected?.pk_Meeting_ID,
        MeetingTranscriptItem_Note: this.transcriberMeetingNote
      })
      this.$transcriberMeeting_addTranscriberMeetingHandler(payload, this.userProfile?.pk_User_ID);
    }
    if (!this.meetingSelected?.pk_Meeting_ID && !this.transcriberMeetingNote) {
      this.$transcriberMeeting_addMeeting();
    }
    if (this.meetingSelected?.pk_Meeting_ID && !this.transcriberMeetingNote) {
      this.alertService.errorAlert('Message content is required !');
    }
  }

  $transcriberMeeting_getMaxIdMeeting(meetingList) {
    return meetingList?.[meetingList.length - 1]?.pk_Meeting_ID;
  }

  $transcriberMeeting_addMeetingAndAddTranscriberMeeting(content?: string, userId?: number) {
    let payload = meetingDto({
      selectedProjectID: this.selectedProjectID,
      MeetingAttendees: this.attendeesList,
      MeetingType: this.meetingTypeChosen
    });
    this.meetingService.addMeeting(payload).pipe(
      mergeMap(_ => this.meetingService.getAllMeetings()),
      mergeMap((res) => {
        this.store.dispatch(updateMeetingList({ items: res || [] }));
        let maxId = this.$transcriberMeeting_getMaxIdMeeting(res);
        let payloadTransriberMeeting = transcriberMeetingItemDto({
          fk_User_ID: userId || this.userProfile?.pk_User_ID,
          fk_Meeting_ID: maxId,
          MeetingTranscriptItem_Note: content || this.transcriberMeetingNote
        });
        return this.transcriberMeetingService.addTranscriberMeeting(payloadTransriberMeeting)
      })
    ).subscribe(_ => {
      this.isDisabledButton = false;
      this.$transcriberMeeting_cleanForm();
      this.alertService.successAlert('Add meeting transcriber success !');
      this.$transcriberMeeting_getMeetingByProject(true);
      this.attendeesList = [];
    });
  }

  $transcriberMeeting_addTranscriberMeetingHandler(payload, userId?: number) {
    let isAuth = isAuthorized(this.usersList, userId);
    this.transcriberMeetingService.addTranscriberMeeting(payload).pipe(takeUntil(this.destroy$)).subscribe(_ => {
      this.$transcriberMeeting_cleanForm();
      this.alertService.successAlert('Add meeting transcriber success !');
      this.listTranscriberByMeeting.push({ ...payload, MeetingTransscriptItem_DateOfCreation: new Date().toISOString(), isRightPosition: isAuth });
      this.$transcriberMeeting_scrollBottom();
      // INFO : after 2s when add comment, need to get all transcriber meeting item again 
      timer(500).subscribe(() => this.$transcriberMeeting_getAllTransriberMeetingItem(true));
      this.isDisabledButton = false;
    });
  }

  $transcriberMeeting_cleanForm() {
    this.transcriberMeetingNote = '';
  }

  $transcriberMeeting_openModalGetUsers() {
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

  $transcriberMeeting_scrollBottom() {
    scrollBottom();
  }

  $transcriberMeeting_focus(transcriberMeetingContent) {
    this.contentTranscriber = transcriberMeetingContent;
  }

  $transcriberMeeting_focusout(transcriberMeeting) {
    this.isDisabledButton = true;
    if (this.contentTranscriber?.length) {
      if (transcriberMeeting.pk_MeetingTranscriptItem_ID) {
        if (this.contentTranscriber !== transcriberMeeting?.MeetingTranscriptItem_Note) {
          this.transcriberMeetingService.updateTranscriberMeeting({ ...transcriberMeeting, MeetingTranscriptItem_Note: this.contentTranscriber })
            .pipe(takeUntil(this.destroy$))
            .subscribe(_ => {
              this.alertService.successAlert('Edit meeting transcriber success !');
              this.listAllMeetingTranscriber.forEach(item => {
                if (item.pk_MeetingTranscriptItem_ID === transcriberMeeting.pk_MeetingTranscriptItem_ID) item.MeetingTranscriptItem_Note = this.contentTranscriber;
              });
              this.isDisabledButton = false;
            })
        }
      } else {
        // INFO : transcriber added by drag
        if (this.meetingSelected?.pk_Meeting_ID) {
          let payload = transcriberMeetingItemDto({
            fk_User_ID: transcriberMeeting?.fk_User_ID || 0,
            fk_Meeting_ID: this.meetingSelected?.pk_Meeting_ID,
            MeetingTranscriptItem_Note: this.contentTranscriber
          })
          this.$transcriberMeeting_addTranscriberMeetingHandler(payload, payload.fk_User_ID);
          this.$transcriberMeeting_deleteTransriberMeeting(transcriberMeeting.randomId);
        } else {
          // INFO : add new meeting, and transcriber for this meeting
          this.$transcriberMeeting_addMeetingAndAddTranscriberMeeting(this.contentTranscriber, transcriberMeeting?.fk_User_ID);
        }
      }
    }
  }

  $transcriberMeeting_activeMeetingType(index: number) {
    this.meetingTypes.map(item => item.isActive = false);
    this.meetingTypes[index].isActive = true;
    this.$transcriberMeeting_getMeetingType(index + 1);
  }

  $transcriberMeeting_getMeetingType(index: number) {
    this.meetingTypeChosen = index;
  }

  $transcriberMeeting_onDropUserToModalBody(event) {
    const user = event.item.data;
    let isAuth = isAuthorized(this.usersList, user.pk_User_ID);
    this.listTranscriberByMeeting.push({
      isRightPosition: isAuth,
      fk_User_ID: user.pk_User_ID,
      MeetingTranscriptItem_Note: '',
      MeetingTransscriptItem_DateOfCreation: new Date().toString(),
      itemCanDelete: true,
      randomId: randomId(),
    });
    this.$transcriberMeeting_scrollBottom();
  }

  $transcriberMeeting_deleteTransriberMeeting(id: string = '') {
    this.listTranscriberByMeeting = this.listTranscriberByMeeting.filter(item => item?.randomId !== id);
  }

  $transcriberMeeting_onDrop(event: CdkDragDrop<string[]>) {
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

  $transcriberMeeting_trackById(index: number, item) {
    return item?.pk_MeetingTranscriptItem_ID;
  }
}
