import { Component, OnInit, Input, APP_INITIALIZER } from '@angular/core';
import { NexmoClientService } from '../nexmo-client.service'


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
  callStatus:Boolean = false;
  constructor(private nexmoClient:NexmoClientService) { 
    this.userName = nexmoClient.getUser();
    this.jwt = nexmoClient.getJwt();

  }

  ngOnInit() {
    this.initialize();
  }

  async initialize(){
    // create application instance and authenticate with cloud usign jwt
    this.application = await this.nexmoClient.client.login(this.jwt);
    console.log("logged in as "+this.application.me.name);
    this.loggedIn = true;

    this.application.on("member:call", (member, call) => {
      function terminateCall(){
        call.hangUp();
        toggleCallStatus('idle');
      }
      
      // Retrieve the Conversation so that we can determine if a 
      // Member has left and refresh the button state
      this.conversation = call.conversation;
      this.conversation.on("member:left", (member, event) => {
        console.log("Member left");
      });

      function toggleCallStatus(state){
        this.callStatus = state;
      }
    })

  }

  makeCall(){
    // this.application.callServer(this.application.me.name);
    // this.application.callServer("919739408177");
    this.application.callServer("919591736521");
  }
}
