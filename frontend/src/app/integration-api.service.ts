import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { application } from 'express';

@Injectable({
  providedIn: 'root'
})
export class IntegrationAPIService {

  baseURL = 'http://localhost:80/api';
  constructor(private http: HttpClient) { }

  getPacientes(): Observable<any>{
    let headers = new HttpHeaders({
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    })

    return this.http.get(`${this.baseURL}/data`,{headers:headers})
  }
}
