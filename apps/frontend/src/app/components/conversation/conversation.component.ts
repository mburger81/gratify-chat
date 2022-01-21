import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import * as _ from 'lodash';
import { Subject } from 'rxjs';


// custom imports
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  title: any;
  groupId: any;
  message: any;
  group: any;

  messagesToShow = [];
  isAdmin: any;
  userId;
  image;
  keyMessage;

  img = 'assets/profile.png';

  private onScreenKeyboard = false;
  private keyboardSubscription: Subject<void>;
  private subscription: any;

  @ViewChild('IonContent', { static: true }) IonContent: IonContent


  constructor(
    private actRoute: ActivatedRoute,
    private afDB: AngularFireDatabase,
    private platform: Platform,
    private router: Router,
    // custom imports
    private authService: AuthService,
    private dataServices: DataService
  ) {
    this.groupId = this.actRoute.snapshot.paramMap.get('key')

    this.keyboardSubscription =
          this.platform
                .keyboardDidShow
                  .subscribe(
                    (ev) => {
                      this.onScreenKeyboard = true;

                      if (!this.keyboardSubscription.closed) {
                        this.keyboardSubscription.unsubscribe();
                      }
                    }
                  ) as Subject<void>;
  }

  ngOnInit() {
    this.userId = this.authService.user?.uid;
    this.subscription = this.dataServices.groups(this.groupId).valueChanges().subscribe((group) => {
      this.group = group;
      if (group.admin) {
        const index = _.indexOf(group.admin, this.authService.user?.uid);
        if (index > - 1) {
          this.isAdmin = true;
        }
      }
      //for the title
      this.title = group.name;
      this.image = group.img;
      //get the message from the group
      this.dataServices.getGroupMessage(this.groupId).valueChanges().subscribe((messages) => {
        this.messagesToShow = [];
        messages.forEach((message) => {
          const tempMessage = message;
          let tempData = <any>{}
          tempData = tempMessage;
          tempData.date = new Date(tempData.date).getMilliseconds();
          tempData.myMsg = tempData.userId === this.userId;
          this.dataServices.getUser(tempMessage.userId).valueChanges().subscribe((user) => {
            tempData.name = user.username;
            tempData.avatar = user.img;
          });
          this.messagesToShow.push(tempData);
        })
      })
    })

  }

  keydown(event: KeyboardEvent) {
    if (this.onScreenKeyboard) {
      return;
    }

    if (event.key === 'Enter') {
      if (event.ctrlKey || event.metaKey) {
        this.message = this.message.concat('\n');
      } else {
        event.preventDefault();
        this.sendMessage();
      }
    }
  }

  // Send text message to the group.
  sendMessage() {
    var promise = new Promise((resolve, reject) => {
      let messages = {
        date: new Date().toString(),
        userId: this.authService.user?.uid,
        type: 'text',
        message: this.message
      }
      let convasation = {
        key: this.groupId,
        me: "you",
        type: 'text',
        view: 'group',
        // read: 'unread',
        date: new Date().toString(),
      }
      //update group message
      firebase.database().ref('groups').child(this.groupId).child('messages').push(messages).then((sucess) => {
        this.keyMessage = sucess.key;
        var keys = sucess.key;
        sucess.update({
          key: keys
        })
        this.message = '';
        setTimeout(() => {
          this.scrollToBottom()
        }, 10)
      }).then(() => {
        for (let i = 0; i < this.group.members.length; i++) {
          firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
            key: this.keyMessage
          });
          this.afDB.database.ref('conversations').child(this.group.members[i]).orderByChild('key').equalTo(this.groupId).once('value', snapshot => {
            var res = snapshot.val();
            if (res != null) {
              let store = Object.keys(res)
              this.afDB.database.ref('conversations').child(this.group.members[i]).child(store[0]).remove().then(() => {
                this.afDB.database.ref('conversations').child(this.group.members[i]).push(convasation).then(() => {
                  resolve(true);
                })
              }).catch((err) => {
                reject(err);
              })
            } else {
              this.afDB.database.ref('conversations').child(this.group.members[i]).push(convasation).then(() => {
                resolve(true);
              })
            }
          }).then(() => {
          }).catch((err) => {
            reject(err);
          })

        }
      });
    });
    return promise;
  }

  // route to the group-info page alone with the groupId
  groupInfo() {
  //  console.log('Conversation#component#groupInfo');
   this.router.navigate(['/dashboard/group-info', { 'key': this.groupId }]);
  }

  more(ev: any) {
    console.log('Conversation#component#more');
  }

  //scroll to the bottom
  private scrollToBottom() {
    this.IonContent.scrollToBottom(100)
  }
}
