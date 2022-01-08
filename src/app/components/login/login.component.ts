import { Component } from '@angular/core';
// import { User, UserCredential } from 'firebase/auth';


// custom imports
import { AuthService } from '../../shared/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {


  constructor(private auth: AuthService) { }


  loginWithGoogle(event: MouseEvent) {
    // console.log('LoginComponent#loginWithGoogle; event:', event);

    this.auth.loginWithGoogle()
                // .then((userCred: UserCredential) => {
                // })
                .catch((error) => {
                  // console.log('yyyyyyy');
                  // console.log(error);
                  // console.log('yyyyyyy');
                });
  }

  loginWithGithub(event: MouseEvent) {
    // console.log('LoginComponent#loginWithGithub; event:', event);

    this.auth.loginWithGithub()
                // .then((userCred: UserCredential) => {
                // })
                .catch((error) => {
                  // console.log('yyyyyyy');
                  // console.log(error);
                  // console.log('yyyyyyy');
                });
  }

  loginWithTwitter(event: MouseEvent) {
    // console.log('LoginComponent#loginWithTwitter; event:', event);

    this.auth.loginWithTwitter()
                // .then((userCred: UserCredential) => {
                // })
                .catch((error) => {
                  // console.log('yyyyyyy');
                  // console.log(error);
                  // console.log('yyyyyyy');
                });
  }
}
