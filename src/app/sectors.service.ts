import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { MessageService } from './message.service';
import { SectorsPageData } from "./model/sectorspagedata";

@Injectable({
  providedIn: 'root'
})

export class SectorsService {

  private sectorsUrl = 'sectorpage';
  private userUrl = 'updatename';
  private saveUrl = 'saveresult';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getSectorsPageData(): Observable<SectorsPageData> {
    return this.http.get<SectorsPageData>(this.sectorsUrl)
      .pipe(
        // tap(_ => this.log('fetched ' + _.length + ' sectors')),
      );
  }

  updateUser(name: string): Observable<string> {
    return this.http.put<string>(this.userUrl, name, this.httpOptions);
  }

  updateSectorsByName(sectorsPageData: SectorsPageData): Observable<SectorsPageData> {
    return this.http.put<SectorsPageData>(this.saveUrl, sectorsPageData, this.httpOptions)
  }

  private log(message: string) {
    this.messageService.add(`SectorService: ${message}`);
  }
}
