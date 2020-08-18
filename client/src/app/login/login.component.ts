import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { Router } from '@angular/router' 
import { NexmoClientService } from '../nexmo-client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: string = '';

  jwt: String ='';
  constructor(private router : Router,private  nexmoClient : NexmoClientService) { }

  ngOnInit() {

  }
 
  async login(){
    
    console.log(this.userName);
    
    if(this.userName === "john"){
      console.log("valid user name: "+this.userName);
      
      let loginUrl = 'http://localhost:3000/auth/'+this.userName;
      const response = await fetch(loginUrl);
      this.jwt = await response.json();
      console.log("Jwt: "+this.jwt);
      this.nexmoClient.setUser(this.userName);
      this.nexmoClient.setJwt(this.jwt);
    
      // navigate to home page
      this.router.navigate(['/home'], { skipLocationChange : false });
      
    } else {
      console.log("invalid username");
      alert("Username invalid")
      // return;
    }
   
  }
}
