import { Injectable } from "@angular/core";
import { CallApiService } from '../../shared/services/call-api.service';
import { USERS_API_END_POINT } from '../../configs/url';

@Injectable()

export class UserService {
  constructor(private apiService: CallApiService,
  ) {
  }

  getAllUser() {
    return this.apiService.callApiGet(USERS_API_END_POINT);
  }

  updateUser(body: any) {
    return this.apiService.callApiPut(USERS_API_END_POINT, body);
  }
}