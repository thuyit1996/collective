import { Injectable } from '@angular/core';
import { CallApiService } from '../../shared/services/call-api.service';
import { PROJECTS_API_END_POINT, USERS_API_END_POINT, USERS_OF_PROJECT } from '../../configs/url';
@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  constructor(
    private apiService: CallApiService
  ) {

  }
  getAllProjects() {
    return this.apiService.callApiGet(PROJECTS_API_END_POINT);
  }

  getProjectById(id: number) {
    return this.apiService.callApiGet(PROJECTS_API_END_POINT + id);
  }

  addProject(projectData: any) {
    return this.apiService.callApiPost(PROJECTS_API_END_POINT, JSON.stringify(projectData));
  }

  updateProject(projectData: any) {
    return this.apiService.callApiPut(PROJECTS_API_END_POINT, projectData);
  }

  deleteProjectById(projectId: number) {
    return this.apiService.callApiDelete(PROJECTS_API_END_POINT + projectId);
  }

  getAllUser() {
    return this.apiService.callApiGet(USERS_API_END_POINT);
  }

  getUserOfProject(projectId: number) {
    return this.apiService.callApiGet(USERS_OF_PROJECT + projectId);
  }

}
