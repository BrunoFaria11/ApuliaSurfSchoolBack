import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GetReservationByClientCommand } from '../models/reservations/get-reservation-by-client-command';
import { Observable } from 'rxjs';
import { UUIDReservationCommand } from '../models/reservations/mark-reservation-as-paid-command';
import { MarkReservationAsValidatedCommand } from '../models/reservations/mark-as-validated-command';
import { CreateReservationCommand } from '../models/reservations/create-reservation-command';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {

  private apiUrl = environment.cm + '/api/Reservations';

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': 'true',
    }),
  };

  getAll(): Observable<any> {
    return this.http.get<Response>(`${this.apiUrl}/GetAll`);
  }

  getByClient(query: GetReservationByClientCommand): Observable<any> {
    return this.http.get<Response>(`${this.apiUrl}/GetByClient`, { params: { ...query } });
  }

  getAllPending(): Observable<any> {
    return this.http.get<Response>(`${this.apiUrl}/GetAllPending`);
  }

  getDashboard(): Observable<any> {
    return this.http.get<Response>(`${this.apiUrl}/Dashboard`);
  }

  registerReservation(command: CreateReservationCommand): Observable<any> {
    return this.http.post<Response>(`${this.apiUrl}/Create`, command);
  }

  markAsPaid(command: UUIDReservationCommand): Observable<any> {
    return this.http.put<Response>(`${this.apiUrl}/MarkAsPaid`, command);
  }

  markAsValidated(command: MarkReservationAsValidatedCommand): Observable<any> {
    return this.http.put<Response>(`${this.apiUrl}/Validate`, command);
  }

  Cancel(command: UUIDReservationCommand): Observable<any> {
    return this.http.put<Response>(`${this.apiUrl}/Cancel`, command);
  }
  
}

