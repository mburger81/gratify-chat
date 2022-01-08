import { Injectable, OnDestroy } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  User
} from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { Router } from '@angular/router';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;

  constructor(private auth: Auth, private router: Router) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth)
                              .pipe(
                                traceUntilFirst('auth'),
                                map(u => !!u)
                              ).subscribe(
                                (isLoggedIn) => {
                                  if (isLoggedIn) {
                                    this.router.navigate(['/chat']);
                                  } else {
                                    this.router.navigate(['/login']);
                                  }
                                }
                              );
    }
  }
  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGithub() {
    return signInWithPopup(this.auth, new GithubAuthProvider());
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  loginWithTwitter() {
    return signInWithPopup(this.auth, new TwitterAuthProvider());
  }

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}