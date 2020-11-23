import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:8090/api/users";
  private API_SERVER = "http://localhost:8090/api/";

  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(){
    return this.httpClient.get(this.REST_API_SERVER);
  }
  public getUrlServer(){
    return this.REST_API_SERVER;
  }
  public obtenerUrlServer(){
    return this.API_SERVER;
  }
}