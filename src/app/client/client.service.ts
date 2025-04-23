import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable,of, throwError } from 'rxjs';
import { Client } from './model/Client';
import { Client_DATA } from './model/mock-clients';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor( private http: HttpClient) { }

  private baseUrl = 'http://localhost:8080/client';

  getClient(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  saveClient(client: Client): Observable<Client> {
  const { id } = client;
  const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
  return this.http.put<Client>(url, client).pipe(
    catchError(error => {
      // Propagar el error al componente
      return throwError(() => error);
    })
  );
}

  deleteClient(idClient : number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idClient}`);
  }
  
  getAllClients(): Observable<Client[]> {
          return this.http.get<Client[]>(this.baseUrl);
      }
}
