import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProjectService } from '../../../../core/services/project.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { Observable, iif, of } from 'rxjs';
import { localStorageService } from '../../../../configs/localStorage';
import { OperatorUtils } from '../../../../core/utils/operators.util';
import { AppState } from '../../../../core/store/app.state';
import { Store, select } from '@ngrx/store';
import { getUsersList } from '../../../../core/store/user/users.selector';
import { takeUntil } from 'rxjs/operators';
import { DestroyableDirective } from '../../../../shared/directives/destroyable.directive';
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent extends DestroyableDirective implements OnInit {
  projectData: any;
  modalHeader: string;
  projectId: number;
  actionType: string;
  isModalOpen: boolean = true;
  vm$: Observable<any>;
  modalAddProjectFormGroup: FormGroup;
  listUser = [];
  listUserChosen = [];
  isLoading: boolean;
  userInformation: any = {};
  startDate = '';
  endDate = '';
  isShowDragText = true;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
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
    this.$modalAddProject_onCreateFormHandler();
    this.$modalAddProject_getProjectById();
    this.$modalAddProject_getUserOfProject();
    this.$modalAddProject_getViewModel();
  }

  $modalAddProject_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<any>({
      usersList: this.store.pipe(select(getUsersList)),
    });
    this.$modalAddProject_getProfile();
  }

  $modalAddProject_getProfile() {
    let userName = localStorageService.getByKey('user-name');
    this.vm$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (userName) {
        this.userInformation = (res?.usersList || []).find(item => item.User_Email === userName);
        if (this.userInformation) {
          this.userInformation.fallBackName = this.$modalAddProject_customName(this.userInformation?.User_Initials, this.userInformation?.User_Email);
        }
      }
    })
  }

  $modalAddProject_customName(name, email) {
    return !name ? (email?.charAt(0) + email?.charAt(1))?.toUpperCase() : name;
  }

  $modalAddProject_getProjectById() {
    if (this.actionType === 'Edit') {
      this.projectService.getProjectById(this.projectId).subscribe(projectData => {
        this.projectData = projectData;
        this.startDate = this.projectData?.Project_StartDate || '';
        this.endDate = this.projectData?.Project_DueDate || ''
        this.modalAddProjectFormGroup.patchValue({
          Project_name: this.projectData?.Project_Name || '',
          Project_note: this.projectData?.Project_Description || '',
        });
      });
    }
  }

  $modalAddProject_getUserOfProject() {
    if (this.actionType == 'Edit') {
      let a = this.projectService.getUserOfProject(this.projectId);
      let b = this.projectService.getAllUser();
      OperatorUtils.forkJoinCustom([a, b])
        .subscribe(res => {
          res[0]?.length ? this.listUserChosen = res[0] : [];
          res[1]?.length ? this.listUser = res[1] : [];
          this.listUserChosen.forEach(item => item.fallbackName = this.$modalAddProject_addFallBackUserName(item));
          this.listUser.forEach(item => item.fallbackName = this.$modalAddProject_addFallBackUserName(item));
          let chosenUserIdList = this.listUserChosen.map(item => item?.pk_User_ID);
          this.listUser = this.listUser.filter(user => !chosenUserIdList.includes(user.pk_User_ID));
          this.isShowDragText = !this.listUserChosen?.length;
        });
    } else {
      this.projectService.getAllUser().subscribe(res => {
        res?.length ? this.listUser = res : this.listUser = [];
        this.listUser.forEach(item => item.fallbackName = this.$modalAddProject_addFallBackUserName(item));
      })
    }
  }


  $modalAddProject_addFallBackUserName(data) {
    return !data?.User_Initials ? (data?.User_Email?.charAt(0) + data?.User_Email?.charAt(1))?.toUpperCase() : data.User_Initials;
  }

  $modalAddProject_onCreateFormHandler() {
    this.modalAddProjectFormGroup = this.formBuilder.group({
      Project_name: ['', Validators.required],
      Start_date: ['', Validators.required],
      End_date: ['', [Validators.required]],
      Project_note: ['', [Validators.required]]
    });
  }

  $modalAddProject_closeModal() {
    this.activeModal.close();
    this.isModalOpen = false;
  }

  $modalAddProject_onDrop(event: CdkDragDrop<string[]>) {
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

  $modalAddProject_onAddProjectHandler() {
    let formValue = this.$modalAddProject_validatorForm();
    if (formValue) {
      iif(() => this.actionType === 'Add', of(formValue), of({ ...this.projectData, ...formValue })).subscribe(val => formValue = val);
      formValue.ProjectUsers = this.$modalAddProject_getUserChoosen();
      this.$modalAddProject_submitFormHandler(formValue);
    }
  }

  $modalAddProject_validatorForm() {
    const projectName = this.modalAddProjectFormGroup.controls.Project_name.value;
    const startDate = this.modalAddProjectFormGroup.controls.Start_date.value;
    const endDate = this.modalAddProjectFormGroup.controls.End_date.value;
    const projectDes = this.modalAddProjectFormGroup.controls.Project_note.value;
    if (!projectName) {
      this.alertService.errorAlert('Project name is required !');
      return;
    }
    if (!startDate) {
      this.alertService.errorAlert('Project start date is required !');
      return;
    }
    if (!endDate) {
      this.alertService.errorAlert('Project end date is required !');
      return;
    }
    if (!projectDes) {
      this.alertService.errorAlert('Project description is required !');
      return;
    }
    return {
      Project_Name: projectName,
      Project_StartDate: startDate,
      Project_DueDate: endDate,
      ProjectUsers: [],
      Project_Description: projectDes,
    };
  }

  $modalAddProject_getUserChoosen() {
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

  $modalAddProject_submitFormHandler(formValue) {
    this.isLoading = true;
    iif(() => this.actionType === 'Add', this.projectService.addProject(formValue), this.projectService.updateProject(formValue)).subscribe(
      () => {
        this.activeModal.close('ACTION_MODAL_SUCCESS');
        this.alertService.successAlert(`${this.actionType} project success !`);
      },
      () => {
        this.alertService.errorAlert(`${this.actionType} project failed !`);
      },
    )
  }
}
