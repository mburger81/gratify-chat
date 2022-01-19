/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { EventService } from './event.service';
import * as _ from 'lodash';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  buddymessages = [];
  boddyUser
  Conversations = [];

  lenght

  constructor(
    public agAuth: AngularFireAuth,
    public eventService: EventService,
    public afDB: AngularFireDatabase,
    public angularDb: AngularFireDatabase,
    private authService: AuthService
  ) { }

  // get the message list from message page invoke
  getMessage(userId) {
    let res;
    this.afDB.database.ref('/messages').child(this.authService.getUser()?.uid).child(userId).on('value', (snapshot) => {
      this.buddymessages = []
      res = snapshot.val()
      for (var i in res) {
        this.buddymessages.push(res[i])
      }
      this.eventService.publish('messages')
    })
  }

  // for the conversation list from page list
  getConversations() {
    this.afDB.database.ref('/conversations/').child(this.authService.getUser()?.uid).on('value', snap => {
      this.Conversations = []
      var array1 = []
      var res = snap.val()
      for (var i in res) {
        this.Conversations.push(res[i])
        array1.push(res[i].userId)
      }
      // this.eventService.publish('conversations');
      this.afDB.database.ref('/accounts/').on('value', snap => {
        this.boddyUser = []
        var res = snap.val();
        var array = []
        for (var i in res) {
          array.push(res[i])
        }
        for (var d in array1) {
          for (var c in array) {
            if (array[c].userId === array1[d]) {
              this.boddyUser.push(array[c])
            }
          }
        }
        this.eventService.publish('conversations');
      })


    })
  }
}
