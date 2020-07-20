import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { transformDateToISOString } from '../../../../utils/transformDate';
import { Observable, of, defer } from 'rxjs';
import { MeetingService } from '../../../../core/services/meeting.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { OperatorUtils } from '../../../../core/utils/operators.util';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/store/app.state';
import { getUsersList } from '../../../../core/store/user/users.selector';
import { takeUntil } from 'rxjs/operators';
import { localStorageService } from '../../../../configs/localStorage';
import { DestroyableDirective } from '../../../../shared/directives/destroyable.directive';
@Component({
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.scss'],
})
export class AddMeetingComponent extends DestroyableDirective implements OnInit, OnDestroy {
  meetingData: any;
  meetingId: number;
  enterpriseId: number;
  actionType: string;
  modalHeader: string;
  isModalOpen: boolean = true;
  modalAddMeetingFormGroup: FormGroup;
  vm$: Observable<any>;
  listUser = [];
  listUserChosen = [];
  userInformation: any = {};
  startDate: any = '';
  endDate = '';
  dueDate = '';
  isShowDragText = true;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private meetingService: MeetingService,
    private alertService: AlertService,
    private store: Store<AppState>
  ) {
    super();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeModal.close();
      }
    });
  }

  ngOnInit() {
    this.$modalAddMeeting_onCreateFormHandler();
    this.$modalAddMeeting_getMeetingById();
    this.$modalAddMeeting_getUserOfMeeting();
    this.$modalAddMeeting_getViewModel();
  }

  $modalAddMeeting_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<any>({
      usersList: this.store.pipe(select(getUsersList)),
    });
    this.$modalAddMeeting_getProfile();
  }

  $modalAddMeeting_getProfile() {
    let userName = localStorageService.getByKey('user-name');
    this.vm$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (userName) {
        this.userInformation = (res?.usersList || []).find(item => item.User_Email === userName);
        if (this.userInformation) {
          this.userInformation.fallBackName = this.$modalAddMeeting_customName(this.userInformation?.User_Initials, this.userInformation?.User_Email);
        }
      }
    })
  }

  $modalAddMeeting_customName(name, email) {
    return !name ? (email?.charAt(0) + email?.charAt(1))?.toUpperCase() : name;
  }

  $modalAddMeeting_getMeetingById() {
    if (this.actionType === 'Edit') {
      this.meetingService.getMeetingById(this.meetingId).subscribe(meetingData => {
        this.meetingData = meetingData;
        this.startDate = new Date(this.meetingData?.Meeting_ScheduledStartTime) || '';
        this.endDate = this.meetingData?.Meeting_ScheduledFinishTime;
        this.dueDate = this.meetingData?.Meeting_ScheduledDuration;
        this.modalAddMeetingFormGroup.patchValue({
          Meeting_title: this.meetingData?.Meeting_Name || '',
          Meeting_location: this.meetingData?.Meeting_Location || '',
          Meeting_note: this.meetingData?.Meeting_Description || '',
        });
      });
    }
  }

  $modalAddMeeting_getUserOfMeeting() {
    if (this.actionType == 'Edit') {
      let a = this.meetingService.getUserOfMeeting(this.enterpriseId);
      let b = this.meetingService.getAllUser();
      OperatorUtils.forkJoinCustom([a, b])
        .subscribe(res => {
          res[0]?.length ? this.listUserChosen = res[0] : [];
          res[1]?.length ? this.listUser = res[1] : [];
          this.listUserChosen.forEach(item => item.fallbackName = this.$modalAddMeeting_addFallBackUserName(item));
          this.listUser.forEach(item => item.fallbackName = this.$modalAddMeeting_addFallBackUserName(item));
          let chosenUserIdList = this.listUserChosen.map(item => item?.pk_User_ID);
          this.listUser = this.listUser.filter(user => !chosenUserIdList.includes(user.pk_User_ID));
          this.isShowDragText = !this.listUserChosen?.length;
        });
    } else {
      this.meetingService.getAllUser().subscribe(res => {
        res?.length ? this.listUser = res : this.listUser = [];
        this.listUser.forEach(item => item.fallbackName = this.$modalAddMeeting_addFallBackUserName(item));
      })
    }
  }

  $modalAddMeeting_addFallBackUserName(data) {
    return !data?.User_Initials ? (data?.User_Email?.charAt(0) + data?.User_Email?.charAt(1))?.toUpperCase() : data.User_Initials;
  }
  $modalAddMeeting_onCreateFormHandler() {
    this.modalAddMeetingFormGroup = this.formBuilder.group({
      Meeting_title: ['', Validators.required],
      Start_time: ['', Validators.required],
      End_time: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      Meeting_location: ['', [Validators.required]],
      Meeting_note: ['', [Validators.required]],
    });
  }

  $modalAddMeeting_closeModal() {
    this.activeModal.close();
    this.isModalOpen = false;
  }

  $modalAddMeeting_onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex, event.currentIndex);
    }
    this.isShowDragText = !this.listUserChosen?.length;
  }
  $modalAddMeeting_onAddMeetingHandler() {
    let formValue = this.$modalAddMeeting_validatorForm() as any;
    if (formValue) {
      defer(() => {
        return this.actionType === 'Add' ? of(formValue) : of({ ...this.meetingData, ...formValue });
      }).subscribe(val => formValue = val);
      formValue.MeetingAttendees = this.$modalAddMeeting_getUserChoosen();
      this.$modalAddMeeting_submitFormHandler(formValue);
    }
  }

  $modalAddMeeting_submitFormHandler(formValue) {
    this.actionType === 'Add';
    formValue.Meeting_RecurranceRangeDate = "2020-06-23T00:50:52.23";
    defer(() => {
      return this.actionType === 'Add' ? this.meetingService.addMeeting(formValue) : this.meetingService.updateMeeting(formValue);
    }).subscribe(
      () => {
        this.activeModal.close('ACTION_MODAL_SUCCESS');
        this.alertService.successAlert(`${this.actionType} meeting success !`);
      },
      () => {
        this.alertService.errorAlert(`${this.actionType} meeting failed !`);
      },
    );
  }

  $modalAddMeeting_validatorForm() {
    const meetingTitle = this.modalAddMeetingFormGroup.controls.Meeting_title.value;
    const startTime = this.modalAddMeetingFormGroup.controls.Start_time.value;
    const endTime = this.modalAddMeetingFormGroup.controls.End_time.value;
    const duration = this.modalAddMeetingFormGroup.controls.duration.value;
    const meetingLocation = this.modalAddMeetingFormGroup.controls.Meeting_location.value;
    const meetingDes = this.modalAddMeetingFormGroup.controls.Meeting_note.value;
    if (!meetingTitle) {
      this.alertService.errorAlert('Meeting titlte is required !');
      return;
    }
    if (!startTime) {
      this.alertService.errorAlert('Meeting start time is required !');
      return;
    }
    if (!endTime) {
      this.alertService.errorAlert('Meeting end time is required !');
      return;
    }
    if (!duration) {
      this.alertService.errorAlert('Duration is required !');
      return;
    }
    if (!meetingLocation) {
      this.alertService.errorAlert('Meeting Location is required !');
      return;
    }
    if (!meetingDes) {
      this.alertService.errorAlert('Meeting description is required !');
      return;
    }
    return {
      Meeting_Name: meetingTitle,
      Meeting_ScheduledStartTime: transformDateToISOString(startTime),
      Meeting_ScheduledFinishTime: transformDateToISOString(endTime),
      Meeting_ScheduledDuration: transformDateToISOString(duration),
      Meeting_Location: meetingLocation,
      MeetingAttendees: [],
      Meeting_Description: meetingDes,
    };
  }

  $modalAddMeeting_getUserChoosen() {
    return (this.listUserChosen || []).map(item => {
      return {
        pk_User_ID: item?.pk_User_ID || '',
        User_FirstName: item?.User_FirstName || '',
        User_SecondName: item?.User_SecondName || '',
        User_Colour: item?.User_Colour || '',
        User_Initials: item?.User_Initials || '',
      }
    })
  }
}
