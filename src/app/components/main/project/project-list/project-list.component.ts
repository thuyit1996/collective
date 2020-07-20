import { Component, OnInit } from '@angular/core';
import { OperatorUtils } from '../../../../core/utils/operators.util';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Project } from '../../../../core/models/Project';
import { AppState } from '../../../../core/store/app.state';
import { projectSelector, projectStatusSelector } from '../../../../core/store/project/project.selector';
import { getProjects } from '../../../../core/store/project/project.actions';
import { ModalService } from '../../../../shared/services/modal.service';
import { AddProjectComponent } from '../add-project/add-project.component';
import { Title } from '@angular/platform-browser';
import { ProjectService } from '../../../../core/services/project.service';
import { AlertService } from '../../../../shared/services/alert.service';
interface ProjectListVm {
  projects: Project[];
  isLoading: boolean;
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  vm$: Observable<ProjectListVm>;
  ProjectTableTitle = 'Project List';
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
    private projectService: ProjectService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Project');
    this.$projectList_getProjectListHandler();
    this.$projectList_getViewModel();
  }

  $projectList_getProjectListHandler() {
    this.store.dispatch(getProjects());
  }

  $projectList_getViewModel() {
    this.vm$ = OperatorUtils.vmFromLatest<ProjectListVm>({
      projects: this.store.pipe(select(projectSelector)),
      isLoading: this.store.pipe(select(projectStatusSelector), map(status => status === 'loading'))
    });
  }

  $projectList_deleteProject(projectId: number) {
    this.projectService.deleteProjectById(projectId).subscribe(res => {
      this.alertService.successAlert('Delete project success !');
      this.store.dispatch(getProjects());
    }, err => {
      this.alertService.errorAlert(err?.error || 'Delete project failed !');
    });
  }

  $projectList_editProject(projectId: number) {
    this.modalService.openModal(AddProjectComponent, { size: 'lg' },
      { modalHeader: 'Edit project', actionType: 'Edit', projectId }).then(res => {
        if (res === 'ACTION_MODAL_SUCCESS') {
          this.$projectList_getProjectListHandler();
        }
      });
  }

  $projectList_trackById(index: number, item) {
    return item?.pk_Project_ID;
  }
}
