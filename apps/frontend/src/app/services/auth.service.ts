/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Injectable } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
// import { Observable } from 'rxjs';
// import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private user$: Observable<User | null>;


  constructor(private auth: Auth) {
  }
  // async init() {
  //   await this.user$.pipe(take(1));
  // }


  getUser(): User | null {
    return this.auth.currentUser;
    // console.log('blub');
    // return await this.user$.pipe(take(1)).toPromise();
  }
}
