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

  getPatients(search:string,method:string): Observable<any>{
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': '*'
    })
    return this.http.get(`${this.baseURL}/patient/${method}/${search}`,{headers:headers})
  }

  getPatientById(id:string): Observable<any> {
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': '*'
    })
    return this.http.get(`${this.baseURL}/patient/${id}`, { headers: headers })
  }

  getPatientIndiceCardiacoLast(id: string): Observable<any> {
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': '*'
    })
    return this.http.get(`${this.baseURL}/patient/${id}/indice_cardiaco_last`, { headers: headers })
  }

  getPatientIndicePulmonarLast(id: string): Observable<any> {
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': '*'
    })
    return this.http.get(`${this.baseURL}/patient/${id}/indice_pulmonar_last`, { headers: headers })
  }

  getPatientIndicesBothLast(id: string): Observable<any> {
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': '*'
    })
    return this.http.get(`${this.baseURL}/patient/${id}/both_indices_last`, { headers: headers })
  }

  getDatesIndices(body:object): Observable<any> {
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': '*'
    })
    return this.http.post(`${this.baseURL}/dates/both_indices`, body,{ headers: headers })
  }

}
