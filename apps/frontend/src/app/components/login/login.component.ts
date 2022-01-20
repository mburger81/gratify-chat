import { Component } from '@angular/core';
// import { UserCredential } from 'firebase/auth';


// custom imports
import { LoginService } from '../../shared/services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private loginService: LoginService
  ) { }


  loginWithGoogle() {
    // console.log('LoginComponent#loginWithGoogle;');

    this.loginService
          .loginWithGoogle()
            .then()
            .catch();
  }

}
