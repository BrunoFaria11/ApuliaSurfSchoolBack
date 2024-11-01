// Caminho: src/app/services/packs.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetPacksByClientCommand } from '../models/pack/get-packs-by-client-command';
import { CreatePackCommand } from '../models/pack/create-pack-command';
import { RegisterReservationCommand } from '../models/pack/register-reservation-command';
import { MarkAsPaidCommand } from '../models/pack/mark-as-paid-command';
import { TokenStoreService } from '../stores/token-store.service';

@Injectable({
  providedIn: 'root',
})
export class PacksService {
  private apiUrl = environment.cm + '/api/Packs';

  constructor(private http: HttpClient, public tokenStore: TokenStoreService) { }

  public headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4300',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    'Access-Control-Allow-Credentials': 'true',
    'Authorization': 'Bearer ' + this.tokenStore.Token,
  };

  getPacksByClient(query: GetPacksByClientCommand): Observable<any> {
    return this.http.get<Response>(`${this.apiUrl}/GetByClient`, { headers: this.headers, params: { ...query } });
  }

  createPack(command: CreatePackCommand): Observable<any> {
    return this.http.post<Response>(`${this.apiUrl}/Create`, command, { headers: this.headers });
  }

  registerReservation(command: RegisterReservationCommand): Observable<any> {
    return this.http.post<Response>(`${this.apiUrl}/RegisterReservation`, command, { headers: this.headers });
  }

  markAsPaid(command: MarkAsPaidCommand): Observable<any> {
    return this.http.put<Response>(`${this.apiUrl}/MarkAsPaid`, command, { headers: this.headers });
  }
}
