import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private auth: Auth,
    public angulaeDb: AngularFireDatabase,
    private router: Router
  ) { }


  public loginWithGoogle(): Promise<void> {
    return this.oAuthLogin(new GoogleAuthProvider());
  }

  public logout(): Promise<void> {
    return signOut(this.auth);
  }

  private async oAuthLogin(provider: GoogleAuthProvider): Promise<void> {

    // sign in
    const credential = await signInWithPopup(this.auth, provider);
    // const additionalInfo = getAdditionalUserInfo(credential);
    // console.log('LoginService#oAuthLogin; additionalInfo:', additionalInfo);

    firebase

    // create user in db
    // if (additionalInfo?.isNewUser) {
      await firebase.database().ref("accounts/" + credential.user.uid)
        .once('value').then((accounts) => {
          // this action when the user not created account,
          // it measn if not
          if (!accounts.val()) {
            const userId = credential.user.uid
            // Set the image url link defualt
            const img = credential.user.photoURL || "assets/profile.png";
            // Set default description.
            const description = "Hello! I am a new Communicaters user.";
            const tempData = {
              img: img,
              username: credential.user.displayName,
              phoneNumber: credential.user.phoneNumber,
              email: credential.user.email,
              emailVerified: credential.user.emailVerified,
              description: description,
              nikeName:'',
              userId: userId,
              status: '',
              dateCreated: new Date().toString(),
              kyc: true
            }
            this.angulaeDb.object("accounts/" + credential.user.uid).set(tempData).then(() => {
              // this.loading.hide();
              this.router.navigateByUrl('/dashboard')
            }).then(() => {
              this.angulaeDb.object("accounts/" + credential.user.uid).update({
                status: "Online"
              })
            })
          } else {
            this.router.navigateByUrl('/dashboard').then(() => {
              // this.loading.hide();
              this.angulaeDb.object("accounts/" + credential.user.uid).update({
                status: "Online"
              })
            })
          }
        })
    // }
  }

}
