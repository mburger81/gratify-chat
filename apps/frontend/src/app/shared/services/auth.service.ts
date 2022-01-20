import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
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


  get user(): User | null {
    return this.auth.currentUser;
    // return await this.user$.pipe(take(1)).toPromise();
  }
}
