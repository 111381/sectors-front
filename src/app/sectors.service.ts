import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Sector } from './sector';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SectorsService {

  private sectorsUrl = 'sectors';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getSectors(): Observable<Sector[]> {
    return this.http.get<Sector[]>(this.sectorsUrl)
      .pipe(
        // tap(_ => this.log('fetched ' + _.length + ' sectors')),
        catchError(this.handleError<Sector[]>('getSectors', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log('${operation} failed: ${error.message}');
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`SectorService: ${message}`);
  }
}
