/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { StatusService } from './../../services/status.service';
import { LoadingService } from './../../services/loading.service';
import { DataService } from './../../services/data.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage implements OnInit {

  phoneNumber: any;
  constructor(
    private router: Router,
    public afdb: AngularFireDatabase,
    public dataService: DataService,
    public loading: LoadingService,
    public statusService: StatusService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.dataService.getCurrentUser(this.authService.getUser()?.uid).valueChanges().subscribe((user) => {
      // pass the parameter to the veriable
      this.phoneNumber = user.phoneNumber;
    })

  }
  // make route to change number
  change() {
    this.router.navigateByUrl('/changenumber')
  }

  //Delete your account and database
  delete() {
    this.loading.show();
    this.afdb.object('/account' + this.authService.getUser()?.uid).query.orderByChild('phoneNumber').equalTo(this.phoneNumber).once('value', snap => {
      this.afdb.database.ref('/account').child(this.authService.getUser()?.uid).remove().then(() => {
        firebase.auth().signOut().then((success) => {
          this.loading.hide()
          this.router.navigateByUrl('/welcome')
        })
      })
    })
  }


}
