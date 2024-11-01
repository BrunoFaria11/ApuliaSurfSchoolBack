import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GetReservationByClientCommand } from '../models/reservations/get-reservation-by-client-command';
import { Observable } from 'rxjs';
import { UUIDReservationCommand } from '../models/reservations/mark-reservation-as-paid-command';
import { MarkReservationAsValidatedCommand } from '../models/reservations/mark-as-validated-command';
import { CreateReservationCommand } from '../models/reservations/create-reservation-command';
import { TokenStoreService } from '../stores/token-store.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {

  private apiUrl = environment.cm + '/api/Reservations';

  constructor(private http: HttpClient, public tokenStore: TokenStoreService) { }

  public headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4300',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    'Access-Control-Allow-Credentials': 'true',
    'Authorization': 'Bearer ' + this.tokenStore.Token,
  };

  getAll(): Observable<any> {
    return this.http.get<Response>(`${this.apiUrl}/GetAll`, { headers: this.headers });
  }

  getByClient(query: GetReservationByClientCommand): Observable<any> {
    return this.http.get<Response>(`${this.apiUrl}/GetByClient`, { headers: this.headers, params: { ...query } });
  }

  getAllPending(): Observable<any> {
    return this.http.get<Response>(`${this.apiUrl}/GetAllPending`, { headers: this.headers });
  }

  getDashboard(): Observable<any> {
    return this.http.get<Response>(`${this.apiUrl}/Dashboard`, { headers: this.headers });
  }

  registerReservation(command: CreateReservationCommand): Observable<any> {
    return this.http.post<Response>(`${this.apiUrl}/Create`, command, { headers: this.headers });
  }

  markAsPaid(command: UUIDReservationCommand): Observable<any> {
    return this.http.put<Response>(`${this.apiUrl}/MarkAsPaid`,  command, { headers: this.headers });
  }

  markAsValidated(command: MarkReservationAsValidatedCommand): Observable<any> {
    return this.http.put<Response>(`${this.apiUrl}/Validate`, command, { headers: this.headers });
  }

  Cancel(command: UUIDReservationCommand): Observable<any> {
    return this.http.put<Response>(`${this.apiUrl}/Cancel`,  command, { headers: this.headers });
  }

}

