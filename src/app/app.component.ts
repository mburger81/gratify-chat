import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


// custom imports
import { AuthService } from './shared/services/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  user: any;
  private readonly userDisposable: Subscription | undefined;


  constructor(private auth: AuthService) {
    this.userDisposable = this.auth.user.subscribe((user) => this.user = user);

  }
  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }


  logout(event: MouseEvent) {
    this.auth.logout();
  }
}
