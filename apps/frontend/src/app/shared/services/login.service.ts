import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication';
import { AuthCredential, signInWithCredential } from 'firebase/auth';
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


  public async loginWithGoogle(): Promise<void> {
    // 1. Create credentials on the native layer
    const result = await FirebaseAuthentication.signInWithGoogle();
    // 2. Sign in on the web layer using the id token
    const credential = GoogleAuthProvider.credential(result.credential?.idToken);
    return this.signInWithCredential(credential);
  }

  public async logout(): Promise<void> {
    await FirebaseAuthentication.signOut();

    return signOut(this.auth);
  }

  private async signInWithCredential(credential: AuthCredential): Promise<void> {

    const userCredential = await signInWithCredential(this.auth, credential);
    // const additionalInfo = getAdditionalUserInfo(userCredential);
    // console.log('LoginService#oAuthLogin; additionalInfo:', additionalInfo);


    // create user in db
    // if (additionalInfo?.isNewUser) {
      await firebase.database().ref("accounts/" + userCredential.user.uid)
        .once('value').then((accounts) => {
          // this action when the user not created account,
          // it measn if not
          if (!accounts.val()) {
            const userId = userCredential.user.uid
            // Set the image url link defualt
            const img = userCredential.user.photoURL || "assets/profile.png";
            // Set default description.
            const description = "Hello! I am a new Communicaters user.";
            const tempData = {
              img: img,
              username: userCredential.user.displayName,
              phoneNumber: userCredential.user.phoneNumber,
              email: userCredential.user.email,
              emailVerified: userCredential.user.emailVerified,
              description: description,
              nikeName:'',
              userId: userId,
              status: '',
              dateCreated: new Date().toString(),
              kyc: true
            }
            this.angulaeDb.object("accounts/" + userCredential.user.uid).set(tempData).then(() => {
              // this.loading.hide();
              this.router.navigateByUrl('/dashboard')
            }).then(() => {
              this.angulaeDb.object("accounts/" + userCredential.user.uid).update({
                status: "Online"
              })
            })
          } else {
            this.router.navigateByUrl('/dashboard').then(() => {
              // this.loading.hide();
              this.angulaeDb.object("accounts/" + userCredential.user.uid).update({
                status: "Online"
              })
            })
          }
        })
    // }
  }

}
