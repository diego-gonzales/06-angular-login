import { showSweetalertErrorMessage } from './../../shared/helpers/sweetalert.helper';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      params: request.params.set('key', environment.apiKey)
    });

    return next.handle(clonedRequest)
              .pipe(
                catchError((err: HttpErrorResponse) => {
                  // Sweetalert's error message can be here or in my components.
                  showSweetalertErrorMessage(err.error.error.message);
                  return throwError(err.error.error.message);
                })
              );
  }
}
