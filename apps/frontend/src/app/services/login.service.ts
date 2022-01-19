/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AlertService } from './alert.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private loading: LoadingService,
    private afAuth: AngularFireAuth,
    public angulaeDb: AngularFireDatabase,
    public alertService: AlertService,
    private alert: AlertController,
    private router: Router,
    private authService: AuthService
  ) { }

  // this help us to create the user database to firebase
  async loginPhoneNumber(phoneNUmber) {
    await firebase.database().ref("accounts/" + this.authService.getUser()?.uid)
      .once('value').then((accounts) => {
        // this action when the user not created account,
        // it measn if not
        if (!accounts.val()) {
          let userId = this.authService.getUser()?.uid
          // Set the image url link defualt
          let img = "assets/profile.png";
          // Set default description.
          let description = "Hello! I am a new Communicaters user.";
          let tempData = {
            img: img,
            username: phoneNUmber,
            phoneNumber: phoneNUmber,
            description: description,
            nikeName:'',
            userId: userId,
            status: '',
            dateCreated: new Date().toString(),
          }
          this.angulaeDb.object("accounts/" + this.authService.getUser()?.uid).set(tempData).then(() => {
            this.loading.hide();
            this.router.navigateByUrl('/verify')
          }).then(() => {
            this.angulaeDb.object("accounts/" + this.authService.getUser()?.uid).update({
              status: "Online"
            })
          })
        } else {
          this.router.navigateByUrl('/verify').then(() => {
            this.loading.hide();
            this.angulaeDb.object("accounts/" + this.authService.getUser()?.uid).update({
              status: "Online"
            })
          })
        }
      })

  }





}
