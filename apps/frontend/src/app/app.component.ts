/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/

import { Component } from '@angular/core';
// import { StatusService } from './services/status.service';


import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  darkMode

  constructor(
    private platform: Platform
    // ,
    // public statusService: StatusService
  ) {
    this.initializeApp();
    this.darkMode = window.localStorage.getItem('dark');

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkDarkTheme()
      SplashScreen.hide();
      // this.statusService.offlineStatus();
    });
  }

  checkDarkTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      document.body.classList.toggle('dark');
      if (Capacitor.isPluginAvailable('StatusBar')) {
        StatusBar.setStyle({ style: Style.Dark });
      }
    } else if (this.darkMode) {
      document.body.classList.toggle('dark');
      if (Capacitor.isPluginAvailable('StatusBar')) {
        StatusBar.setStyle({ style: Style.Dark });
      }
    } else {
      if (Capacitor.isPluginAvailable('StatusBar')) {
        StatusBar.setStyle({ style: Style.Light });
        StatusBar.setBackgroundColor({'color': '#054D44'});
      }
    }
  }
}
