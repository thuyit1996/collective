import { Injectable } from '@angular/core';
import { CallApiService } from '../../shared/services/call-api.service';
import { LOGIN_URL, REGISTER_URL, GET_USER_PROFILE_URL } from '../../configs/url';
import { Auth } from '../models/Auth';
import { JwtHelperService } from '@auth0/angular-jwt';
import { localStorageService } from '../../configs/localStorage';
import { Register } from '../models/Register';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private apiService: CallApiService,
    public jwtHelper: JwtHelperService
  ) {

  }
  onLogin(body: Auth) {
    let newBody = {
      username: body.Auth_Email,
      password: body.Auth_Password,
      grant_type: 'password',
    }
    return this.apiService.callApiQueryString(LOGIN_URL, newBody)
  }

  isAuthenticated(): boolean {
    const token = localStorageService.getByKey('token');
    return !!token;
  }

  onRegister(body: Register) {
    return this.apiService.callApiPost(REGISTER_URL, body);
  }

}
