/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { UserService } from './../../services/user.service';
import { LoadingService } from './../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from './../../services/data.service';
import * as _ from 'lodash';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-chatmore',
  templateUrl: './chatmore.component.html',
  styleUrls: ['./chatmore.component.scss'],
})
export class ChatmoreComponent implements OnInit {

  userId: any;
  isBlock: any;
  currentUserId: any;
  nikeName: any;

  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    private router: Router,
    private toastController: ToastController,
    public dataService: DataService,
    private loading: LoadingService,
    public userService: UserService,
    private alertCtrl: AlertController,
    public afDB: AngularFireDatabase,
    private authService: AuthService
  ) {
    // get userId from pass parameter
    this.userId = this.navParams.get("userId")
    //invoke the current firebase ID for UserID
    this.currentUserId = this.authService.getUser()?.uid;
    // console.log(this.userId)
  }

  ngOnInit() {
    // fetch the database from firebase
    this.dataService.getCurrentUser(this.userId).valueChanges().subscribe((user) => {
      this.nikeName = user.nikeName;
    })

    // get the data,
    // to handle the block methode
    this.dataService.getUser(this.userId).valueChanges().subscribe((user) => {
      this.dataService.userBock(this.authService.getUser()?.uid).valueChanges().subscribe((blocks) => {
        this.isBlock = _.findKey(blocks, block => {
          return block = this.authService.getUser()?.uid;
        })
        if (this.isBlock) {
          this.isBlock = true;
        } else {
          this.isBlock = false;
        }
      })
    })

  }

  // will be close the popOver controller
  eventFromPopover() {
    this.popoverController.dismiss();
  }

  unBlock() {
    // show loading service
    this.loading.show()
    // get block methode from firebase fetch
    this.userService.unblock(this.currentUserId, this.userId).then(() => {
      //hide the loading service
      this.loading.hide();
      // will be close the popOver controller
      this.eventFromPopover()
    })
  }

  // to the block the user funtion
  block() {
    // show loading service
    this.loading.show()
    this.userService.block(this.currentUserId, this.userId).then(() => {
      //hide the loading service
      this.loading.hide();
      // will be close the popOver controller
      this.eventFromPopover();
    })
  }

  // report the user contact to owner
  // this methode is an alertController
  async report() {
    const alert = await this.alertCtrl.create({
      header: 'Report this contact to WhatsApp from Pagas',
      message: "Block contact and delete this chat's messages",
      buttons: [
        {
          text: "CANCEL",
          handler: () => {

          }
        },
        {
          text: "REPORT",
          handler: () => {
            this.loading.show()
            this.deleteChat().then(() => {
              this.presentToast()
              this.loading.hide();
              if (!this.isBlock) {
                this.block();
              }
            })
          }
        }
      ]
    })
    alert.present();

  }

  // this funttion handle the delete chat from firebase
  async deleteChat() {
    this.loading.show();
    this.eventFromPopover();
    await this.afDB.database.ref('messages').child(this.authService.getUser()?.uid).child(this.userId).remove().then(() => {
      this.deleteConversation();
      this.loading.hide();
    })
  }

  // this will delete the conversation content;
  async deleteConversation() {
    await this.afDB.database.ref('conversations').child(this.authService.getUser()?.uid).orderByChild('userId').equalTo(this.userId).once('value', snap => {
      var res = snap.val();
      if (res != null) {
        let store = Object.keys(res)
        this.afDB.database.ref('conversations').child(this.authService.getUser()?.uid).child(store[0]).remove();
      }
    })
  }

  // if something goes wrong, will toast handle
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Report sent and' + this.nikeName + 'has been blocked',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  // this navigate to the contact page.....
  contacts() {
    this.router.navigate(['/contact', { 'userId': this.userId }])
    this.eventFromPopover();
  }


}
