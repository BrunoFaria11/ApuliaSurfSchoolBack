import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Client } from '../models/clients/client';
import { SearchClients } from '../models/clients/search-clients';
import { CreateClient } from '../models/clients/create-client';
import { UpdateClientCommand } from '../models/clients/update-client-command';
import { TokenStoreService } from '../stores/token-store.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private apiUrl = environment.cm + '/api/Clients';

  constructor(private http: HttpClient, public tokenStore: TokenStoreService) { }

  public headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4300',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    'Access-Control-Allow-Credentials': 'true',
    'Authorization': 'Bearer ' + this.tokenStore.Token,
  };

  createClient(clientData: CreateClient): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Create`, clientData, { headers: this.headers });
  }

  searchClients(query: SearchClients): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Search`, { headers: this.headers, params: { ...query } });
  }

  updateClient(command: UpdateClientCommand): Observable<any> {
    return this.http.put<Response>(`${this.apiUrl}/Update`, command, { headers: this.headers });
  }
}

