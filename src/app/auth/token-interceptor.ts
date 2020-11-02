import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './shared/auth.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, take, filter } from 'rxjs/operators';
import { LoginResponse } from './login/response-payload';

@Injectable({
    providedIn: 'root'
})


export class TokenInterceptor implements HttpInterceptor{

    isTokenRefreshing = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(public authService: AuthService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
       const jwtToken =  this.authService.getJwtToken();
        
       if(jwtToken){
           this.addToken(req, jwtToken);
       }
       return next.handle(req);
    }

    private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler)
        : Observable<HttpEvent<any>> {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponse: LoginResponse) => {
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject
                        .next(refreshTokenResponse.authenticationToken);
                    return next.handle(this.addToken(req,
                        refreshTokenResponse.authenticationToken));
                })
            )
        } 
        // else {
        //     return this.refreshTokenSubject.pipe(
        //         filter(result => result !== null),
        //         take(1),
        //         switchMap((res) => {
        //             return next.handle(this.addToken(req,
        //                 this.authService.getJwtToken()))
        //         })
        //     );
        // }
    }

    addToken(req: HttpRequest<any>, jwtToken: any){
        return req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)
        });
    }
}