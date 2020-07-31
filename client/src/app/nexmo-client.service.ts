import { Injectable } from '@angular/core';

declare  var NexmoClient:  any;

@Injectable({
  providedIn: 'root'
})
export class NexmoClientService {
  client:any;
  userName:String ='';
  jwt:String='';
  constructor() { 
    this.client = new NexmoClient();
  }

  setClient(newValue){
    this.client = Object.assign( {}, newValue );
  }
  getClient(){
    return this.client;
  }
  setUser(userName){
    this.userName = userName;
  }
  getUser(){
    return this.userName;
  }
  setJwt(jwt){
    this.jwt = jwt;
  }
  getJwt(){
    return this.jwt;
  }
}
