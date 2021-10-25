import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { User } from '../models/user.model';
import { RegisterResponse } from '../interfaces/register-response.interface';
import { LoginResponse } from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _urlAPI: string = environment.urlAPIFirebase;
  userToken!: string;

  constructor(private http: HttpClient) {
    // In this part must be the 'readToken()' method
  }

  /* For this methods we work with API Firebase: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password */
  // The following methods use 'AuthInterceptor' to add 'apiKey' to the request.

  login(user: User) {
    const requestBody = { ...user, returnSecureToken: true };
    return this.http.post<LoginResponse>(`${this._urlAPI}/accounts:signInWithPassword`, requestBody)
              .pipe(
                // If an error occurs 'map' never executes
                map(resp => {
                  this.saveTokenAndHisExpirationDate(resp.idToken, resp.expiresIn);
                  return resp;
                })
              );
  };

  register(newUser: User) {
    const requestBody = { ...newUser, returnSecureToken: true };
    return this.http.post<RegisterResponse>(`${this._urlAPI}/accounts:signUp`, requestBody)
              .pipe(
                // If an error occurs 'map' never executes
                map(resp => {
                  this.saveTokenAndHisExpirationDate(resp.idToken, resp.expiresIn);
                  return resp;
                })
              );
  };

  isAuthenticated() {
    if (!localStorage.getItem('token')) return false;

    const tokenExpirationDate = Number(localStorage.getItem('tokenExpirationDate'));

    const expirationDate = new Date().setTime(tokenExpirationDate);
    const actualDate = new Date().getTime();

    return (expirationDate > actualDate) ? true : false;
  };

  logout() {
    localStorage.removeItem('token');
  };

  private saveTokenAndHisExpirationDate(idToken: string, expiresIn: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let today = new Date();
    today.setSeconds(Number(expiresIn));
    localStorage.setItem('tokenExpirationDate', today.getTime().toString());

    // today.setTime(today.getTime() + 3600 * 1000); // Add 3600 exactly
  };

  private readToken() {
    localStorage.getItem('token')
        ? this.userToken = localStorage.getItem('token')!
        : this.userToken = '';
  };
}
