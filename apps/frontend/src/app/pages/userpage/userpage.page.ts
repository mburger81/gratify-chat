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
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.page.html',
  styleUrls: ['./userpage.page.scss'],
})
export class UserpagePage implements OnInit {

  excludedIds: any;
  searchUser: any;
  accounts: any;
  account: any;
  currentUserId: any;

  term = '';

  constructor(
    public loading: LoadingService,
    public dataService: DataService,
    // private network: Network,
    private toast: ToastController,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUserId = this.authService.getUser()?.uid;
  }

  ngOnInit() {
    //Initialized
    this.searchUser = "";
    this.dataService.getUsers().valueChanges().subscribe((accounts) => {
      this.accounts = accounts;

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

  chat(userId) {
    // if it's is current user navigate to profile
    if (userId === this.currentUserId) {
      this.router.navigateByUrl("/profile")
    } else {
      // else Not chat Page
      this.router.navigate(['/do-chat', { 'userId': userId }])
    }
  }


}
