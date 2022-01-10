import { Component, OnDestroy } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';


// custom imports
import { AuthService } from './shared/services/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  user: any;
  // users: any[];
  private readonly user$Disposable: Subscription | undefined;


  constructor(private auth: AuthService, private firestore: Firestore) {
    this.user$Disposable = this.auth.user$.subscribe(
                                          (user) => {
                                            this.user = user;
                                            if(user) {
                                              const userRef = doc(this.firestore, `users/${user.uid}`);
                                              setDoc(userRef, { uid: user.uid, displayName: user.displayName });

                                              // this.getUsers();
                                            } else {
                                              // this. users = null;
                                            }
                                          }
                                        );

  }
  ngOnDestroy(): void {
    if (this.user$Disposable) {
      this.user$Disposable.unsubscribe();
    }
  }

  logout(event: MouseEvent) {
    this.auth.logout();
  }

  // private getUsers() {
  //   const usersRef = collection(this.firestore, 'users');
  //   collectionData(usersRef, { })
  //     .subscribe(
  //       (users: any) => {
  //         this.users = users;
  //       }
  //     );
  // }
}
