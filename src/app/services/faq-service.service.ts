import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { QuestionDto } from '../models/QuestionDto';
import { ReponseDto } from '../models/ReponseDto';

@Injectable({
  providedIn: 'root'
})
export class FaqServiceService {
  private apiUrl = 'http://localhost:9000/Faq';
  private userManagementUrl = 'http://localhost:9000/user';

  constructor(private http : HttpClient) { }
  retrieveAllQ(): Observable<QuestionDto[]> {
    return this.http.get<QuestionDto[]>(this.apiUrl + "/retrieveAllQ")
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred while retrieving bank accounts:', error);
          throw error;
        })
      );
  }




  addQ(question: QuestionDto): Observable<any> {
    console.log('Sending question to backend for addition:', question);
    return this.http.post<any>(this.apiUrl + '/addQ', question)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred during question addition:', error);
          return throwError(error);
        })
      );
  }

  addResponse(questionId: number, response: ReponseDto): Observable<ReponseDto> {
    console.log('Sending response to backend for addition:', response);
    return this.http.post<ReponseDto>(`${this.apiUrl}/reponse/${questionId}`, response)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred during response addition:', error);
          return throwError(() => new Error('Failed to add response'));
        })
      );
  }
  getQuestion(questionId: number): Observable<QuestionDto> {
    return this.http.get<QuestionDto>(`${this.apiUrl}/${questionId}`);

  }
  getResponseByQuestionId(questionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/byQuestion/${questionId}`);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteQuestion/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error occurred while deleting question with ID ${id}:`, error);
        return throwError(() => new Error('Failed to delete question'));
      })
    );
  }
  updateQuestion(id: number, updatedQuestion: QuestionDto): Observable<QuestionDto> {
    console.log('Sending updated question to backend:', updatedQuestion);
    return this.http.put<QuestionDto>(`${this.apiUrl}/updateQ/${id}`, updatedQuestion)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`Error occurred during question update with ID ${id}:`, error);
          return throwError(() => new Error('Failed to update question'));
        })
      );
  }


  updateResponde(id: number, updateResponde: ReponseDto): Observable<ReponseDto> {
    console.log('Sending updated response to backend:', updateResponde);
    return this.http.put<ReponseDto>(`${this.apiUrl}/updateR/${id}`, updateResponde)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`Error occurred during response update with ID ${id}:`, error);
          return throwError(() => new Error('Failed to update response'));
        })
      );
  }



  searchQuestions(keyword: string): Observable<QuestionDto[]> {
    return this.http.get<QuestionDto[]>(`${this.apiUrl}/search`, {
      params: { keyword: keyword }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred during question search:', error);
        return throwError(() => new Error('Failed to search questions'));
      })
    );
  }

  searchQuestionsByCreatedBy(createdBy: string): Observable<QuestionDto[]> {
    return this.http.get<QuestionDto[]>(`${this.apiUrl}/searchByCreatedBy`, {
      params: { createdBy: createdBy }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred during search by createdBy:', error);
        return throwError(() => new Error('Failed to search questions by createdBy'));
      })
    );
  }

}
