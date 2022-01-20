import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// custom imports
import { LoginRoutingModule } from './login-routing.module';


@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
