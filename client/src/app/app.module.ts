import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RouterModule} from '@angular/router';
import { NexmoClientService } from './nexmo-client.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent},
      { path: 'login', component: LoginComponent},

      { path : "**", redirectTo : 'login'}])
  ],
  providers: [
    NexmoClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
