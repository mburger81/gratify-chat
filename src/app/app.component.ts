import { Component, OnDestroy } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
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


  constructor(private auth: AuthService, private firestore: Firestore) {
    this.userDisposable = this.auth.user.subscribe(
                                          (user) => {
                                            this.user = user;
                                            if(user) {
                                              const usersRef = doc(this.firestore, `users/${user.uid}`);
                                              setDoc(usersRef, { uid: user.uid });
                                            }
                                          }
                                        );

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
