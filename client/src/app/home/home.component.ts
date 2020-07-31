import { Component, OnInit, Input, APP_INITIALIZER, Inject, ElementRef } from '@angular/core';
import { NexmoClientService } from '../nexmo-client.service'
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';

import * as contacts from '../contacts.json';
import { createOfflineCompileUrlResolver } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName:String = "";
  jwt:String = "";
  application:any;
  conversation:any;
  loggedIn:Boolean = false;
  callState="idle";
  call:any;
  contacts:any;
  currentName="";
  currentNumber="";
  incoming=false;
  received=false;
  rejected=false;

  constructor(private nexmoClient:NexmoClientService,@Inject(DOCUMENT) document) { 
    this.userName = nexmoClient.getUser();
    this.jwt = nexmoClient.getJwt();
    
    
  }

  ngOnInit() {
    this.initialize();
    let tempContacts:any = (contacts as any ).default;
    console.log("temp contacts:");
    console.log(tempContacts);
    this.contacts = {};
    for (var i in tempContacts) {
      console.log("name: "+ tempContacts[i]["name"]);
      console.log("number: "+tempContacts[i]["number"]);
      this.contacts[tempContacts[i]["name"]] =tempContacts[i]["number"];
    }
    console.log(this.contacts);
  }

  async initialize(){
    console.log("in initialize:");
    // create application instance and authenticate with cloud usign jwt
    this.application = await this.nexmoClient.client.login(this.jwt);
    console.log("logged in as "+this.application.me.name);
    this.loggedIn = true; 
    this.application.on("member:call",(member,call) =>{
      this.handleCall(member,call);
    });
    this.application.on("call:status:changed", call => {
      console.log("call status changed:" + call.status);
      this.callStatusChanged(call.status);
    });

  }

  callStatusChanged(status) {
    this.callState = status;
    if (status === "answered") {
      this.toggleButtonColor("green");
    }
  }
  toggleButtonColor(color) {
    if (this.currentName) {
      var button = document.getElementById(this.currentName);
      button.style.backgroundColor = color;
    }
  }

  makeCall(id){
    // this.application.callServer(this.application.me.name);
    // this.application.callServer("919739408177");
    this.currentNumber = this.contacts[id];
    this.currentName = id;
    console.log("called number:"+ this.currentNumber);
    this.toggleButtonColor("#FF8C00");
    this.callState = "call-initiated";
    this.application.callServer(this.currentNumber);
  }

  hangUp() {
    console.log("hanging up");
    this.resetDefaults();
    this.call.hangUp();
    
  }

  handleCallHangup(member,event){
    this.resetDefaults();
    console.log("call hangup")
  }

  async handleCall(member,call){
    console.log("in handle call, call status: "+call.status);
    console.log("member:");
    console.log(member);
    console.log("call");
    console.log(call);
    if(this.callState === "idle") {
      // this is an incoming call wait for user to answer
      this.incoming = true;
      console.log("idle - incoming: "+this.incoming);
      console.log("idle - recieved: "+this.received);
      while(true) {
          // do nothing wait for call to be recieved or rejected
          await this.sleep();
          if(this.received || !this.rejected){
            console.log("value changed:")
            break;
          }
        }
      if (this.rejected) {
        // call rejected exit
        console.log("call rejected")
        call.reject();
        this.resetDefaults();
        return;
      }
      if (this.received) {
        this.call = call;
        call.answer()
      }
    }
    console.log("not idle - incoming: "+this.incoming);
    console.log("not idle - recieved: "+this.received);
    // call received so continue
    // this.toggleButtonColor("green");
    this.call = call;
    this.conversation = call.conversation;
      this.conversation.on("member:left", (member, event) => {
        this.handleCallHangup(member,event);
      });
  }
  resetDefaults(){
    this.toggleButtonColor("#CC0000");
    this.currentName="";
    this.currentNumber="";
    this.received = false;
    this.incoming = false;
    this.rejected = false;
    this.callState = "idle";
    console.log("in reset defaults");
    console.log("name:"+this.currentName);
    console.log("number:"+this.currentNumber);
    console.log("call state:"+ this.callState);
    console.log("recieved: "+ this.received);
    console.log("incoming: "+this.incoming);
    console.log("rejected: "+ this.rejected);

  }

  handleButtonClick(id){
    console.log("in handle buton click: clicked contact: "+ id);
    if(this.currentName===""){
      // no call in progress so make call
      this.makeCall(id);
    } else if (this.currentName === id) {
      // call is in progress so, hang up
      this.hangUp();
      
    } else {
      // some call other call is in progress so no action

    }
  }

  sleep() {
    return new Promise( resolve => setTimeout(resolve,1000));
  }
}
