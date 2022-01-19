/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-chatsetting',
  templateUrl: './chatsetting.page.html',
  styleUrls: ['./chatsetting.page.scss'],
})
export class ChatsettingPage implements OnInit {

  darkMode: any = true;


  constructor(
    private toast: ToastController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.darkMode = false;
  }

  // this handle the themes toogel changing to default to dark mode
  cambio() {
    if (this.darkMode = !this.darkMode) {
      document.body.classList.toggle('dark');
      // pass to the local stoage
      window.localStorage.setItem('dark', this.darkMode);
      let get = window.localStorage.getItem('dark')
      this.platform.ready().then(() => {
        // then intialize the statusBar to the black
        if (Capacitor.isPluginAvailable('StatusBar')) {
          StatusBar.setStyle({ style: Style.Dark });
        }
      })
    } else {
      //clear the local storage
      window.localStorage.clear()
      //remove the local storage
      window.localStorage.removeItem('dark');
      this.platform.ready().then(() => {
        if (Capacitor.isPluginAvailable('StatusBar')) {
          // then intialize the statusBar to the default one
          StatusBar.setBackgroundColor({'color': '#054D44'});
        }
      })
      let get = window.localStorage.getItem('dark')
    }
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



}
