/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../services/loading.service';
import { DataService } from './../../services/data.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-calllist',
  templateUrl: './calllist.page.html',
  styleUrls: ['./calllist.page.scss'],
})
export class CalllistPage implements OnInit {

  excludedIds: any;
  searchUser: any;
  accounts: any;
  account: any;
  currentUserId: any;

  constructor(
    public loading: LoadingService,
    public dataService: DataService,
    // private network: Network,
    private callNumber: CallNumber,
    private toast: ToastController,
    private router: Router,
    private afDB: AngularFireDatabase,
    private authService: AuthService
  ) {
    // pass the currernt userId to the variable
    this.currentUserId = this.authService.getUser()?.uid;
  }

  ngOnInit() {
    //Initialized
    this.searchUser = "";
    this.dataService.getUsers().valueChanges().subscribe((accounts) => {
      this.accounts = accounts;

      // get current user info
      this.dataService.getCurrentUser(this.authService.getUser()?.uid).valueChanges().subscribe((account) => {
        //add own userId as excludedIds.
        this.excludedIds = [];
        this.account = account;
        if (this.excludedIds.indexOf(account.userId) == -1) {
          this.excludedIds.push(account.userId);
        }
      })
    })
  }

  // make call, the item handle the object of each data touch
  call(item) {
    this.callNumber.callNumber(`${item.phoneNumber}`, true).then(() => {
      // fetch the data to current database
      this.afDB.list('/accounts/' + this.authService.getUser()?.uid + '/call/').push({
        date: new Date().toString(),
        userId: item.userId,
        type: 'calling',
        icon: 'call',
        call: 'call'
      }).then(() => {
        this.afDB.list('/accounts/' + item.userId + '/call/').push({
          date: new Date().toString(),
          userId: this.authService.getUser()?.uid,
          type: 'calling',
          icon: 'call',
          call: 'misscall'
        })
      })
      // if something goes wrong handle toast notify
    }).catch(err => this.something());
  }

  // toast notification
  async something() {
    const toast = await this.toast.create({
      message: 'Something going wrong.',
      duration: 2000
    });
    toast.present();
  }

  // make the vieo call, then router take part
  videoCall(item) {
    this.router.navigate(["/calling", { 'image': item.img, 'name': item.nikeName, 'userId': item.userId }])
  }

}
