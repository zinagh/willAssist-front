import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { catchError, Observable, throwError } from 'rxjs';
import { Userdto } from '../models/Userdto';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9000/user';

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}

  addUser(userdto: Userdto): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/add-user', userdto)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }

  updatePassword(username: string, newpass: string, veripass: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('newpass', newpass)
      .set('veripass', veripass);

    return this.http.put<any>(this.apiUrl + `/updatepass`, null, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('An error occurred:', error);
          return throwError(error);
        })
      );
  }
  modifierUser(userdto: Userdto): Observable<any> {
    return this.http.put<any>(this.apiUrl + '/modify-user', userdto)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }
  retrieveAllUsers(): Observable<Userdto[]> {
    return from(this.keycloakService.getToken()).pipe(

      switchMap(token => {
        console.log("Token retrieved:", token); // Check if the token is received correctly
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<Userdto[]>(`${this.apiUrl}/retrieve-all-users`, { headers });
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  retrieveUser(userName: string): Observable<Userdto> {
    return this.http.get<Userdto>(this.apiUrl + `/retrieve-user/${userName}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('An error occurred:', error);
          return throwError(error);
        })
      );
  }
  removeUser(userName: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl +  `/remove-user/${userName}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('An error occurred:', error);
          return throwError(error);
        })
      );
  }



}
