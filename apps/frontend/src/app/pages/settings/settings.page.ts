/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { DataService } from './../../services/data.service';
import { ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  nikeName: any;
  image: any;
  description: any

  constructor(
    private router: Router,
    private toast: ToastController,
    public dataService: DataService,
    private navCtrl: NavController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.dataService.getCurrentUser(this.authService.getUser()?.uid).valueChanges().subscribe((user) => {
      this.nikeName = user.nikeName;
      this.image = user.img
      this.description = user.description;
    })

  }

  //Route to Profile page
  profile() {
    this.router.navigateByUrl('/profile')
  }

  // Route to ACccount
  account() {
    this.router.navigateByUrl('/account')
  }

  chatsetting() {
    this.router.navigateByUrl('/chatsetting')
  }

  notification() {
    this.toastShow()
  }

  //pop a notification
  async toastShow() {
    const toast = await this.toast.create({
      message: 'Oops, This feature is not availabe on this version.',
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  // Route to hlep
  help() {
    this.router.navigateByUrl("/help")
  }

  //Pop Back button
  back() {
    this.navCtrl.pop();
  }
}
