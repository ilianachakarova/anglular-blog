import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable } from 'rxjs';
import { LoginRequestPayload } from '../login/login.request.payload';
import { LoginResponse } from '../login/response-payload';
import { LocalStorageService } from 'ngx-webstorage';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;

  constructor(private HttpClient: HttpClient, private localStorage: LocalStorageService
   ) { }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any>{
   return this.HttpClient.post(this.baseUrl + 'api/auth/signup',signupRequestPayload, {responseType:'text'});
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean>{
    return this.HttpClient.post<LoginResponse>( this.baseUrl + 'api/auth/login',loginRequestPayload)
    .pipe(map(data => {
      this.localStorage.store('authenticationToken', data.authenticationToken);
      this.localStorage.store('username', data.username);
      this.localStorage.store('refreshToken', data.refreshToken);
      this.localStorage.store('expiresAt', data.expiresAt);
      return true;
    }));
    
  }

  getJwtToken(){
    return this.localStorage.retrieve('authenticationToken');
  }

  refreshToken(){
    const refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      username: this.getUsername()
    }
    return this.HttpClient.post<LoginResponse>(this.baseUrl + 'api/auth/refresh/token', 
    refreshTokenPayload)
  }

  getUsername() {
    return this.localStorage.retrieve('username');
  }
  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }
}
