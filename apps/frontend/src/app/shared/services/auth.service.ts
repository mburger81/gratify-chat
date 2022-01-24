import { Injectable } from '@angular/core';
import { Auth, User /*, user*/ } from '@angular/fire/auth';
// import { Observable } from 'rxjs';
// import { take } from 'rxjs/operators';


// custom imports
import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private user$: Observable<User | null>;


  constructor(private auth: Auth) {

    // user(auth)
    //   .subscribe(
    //     (user: User) => {
    //       console.log('user', user);
    //     }
    //   );

  }
  // async init() {
  //   await this.user$.pipe(take(1));
  // }


  get user(): User | null {
    return this.auth.currentUser;
    // return await this.user$.pipe(take(1)).toPromise();
  }
}
