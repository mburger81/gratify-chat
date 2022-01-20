import { Component } from '@angular/core';
import { Router } from '@angular/router';


// custom imports
import { AuthService } from '../../shared/services/auth.service';
import { LoginService } from '../../shared/services/login.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private router: Router,
    // custom imports
    public authService: AuthService,
    private loginService: LoginService
  ) { }


  logout() {
    // console.log('DashboardComponent#logout;');

    this.loginService
          .logout()
            .then(() => this.router.navigateByUrl('/login'))
            .catch();
  }
}
