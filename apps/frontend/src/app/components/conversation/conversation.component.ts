import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import { Clipboard, ReadResult } from '@capacitor/clipboard';
import firebase from 'firebase/compat/app';
import * as _ from 'lodash';
import { finalize, Subject } from 'rxjs';


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
  message = '';
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
    private afstorage: AngularFireStorage,
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
    // console.log('ConversationComponent#keydown; event:', event);

    if (this.onScreenKeyboard) {
      return;
    }

    if (event.key === 'Enter') {
      if (event.ctrlKey || event.metaKey) {
        this.message = this.message.concat('\n');
      } else {
        event.preventDefault();
        this.sendMessage('text', this.message);
      }
    } else if (event.key === 'v' && event.metaKey) {
      event.preventDefault();
      Clipboard
        .read()
        .then(
          (result: ReadResult) => {
            // console.log('ConversationComponent#keydown; result.type:', result.type);
            // console.log('ConversationComponent#keydown; result.value:', result.value);


            if (result.type === 'text/plain') {
              this.message = this.message.concat(result.value);
            } else if (result.type === 'image/png') {
              this.uploadImageFromURL(result.value)
                    .then(
                      // () => {
                      //   console.log('ConversationComponent#keydown; image uploaded!!!');
                      // }
                    );
            }
          }
        );
    }
  }

  // Send text message to the group.
  sendMessage(type: string, message: string) {
    return new Promise((resolve, reject) => {
      const messages = {
        date: new Date().toString(),
        userId: this.authService.user?.uid,
        type: type,
        message: message
      }
      const convasation = {
        key: this.groupId,
        me: "you",
        type: type,
        view: 'group',
        // read: 'unread',
        date: new Date().toString(),
      }
      // update group message
      firebase.database().ref('groups').child(this.groupId).child('messages').push(messages).then((sucess) => {
        this.keyMessage = sucess.key;
        const keys = sucess.key;
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
            const res = snapshot.val();
            if (res != null) {
              const store = Object.keys(res)
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
  }

  // send message photo to user alone with url of photo
  // sendNewPhoto(url) {
  //   if (this.userId) {
  //     return new Promise((resolve, reject) => {
  //       const messages = {
  //         date: new Date().toString(),
  //         userId: this.authService.user?.uid,
  //         type: 'image',
  //         message: url,
  //         read: 'unread',
  //       };
  //       const conversation = {
  //         userId: this.userId,
  //         message: url,
  //         me: "me",
  //         type: 'image',
  //         view: 'chat',
  //         date: new Date().toString(),
  //         read: 'unread',
  //       }
  //       const convasation = {
  //         userId: this.authService.user?.uid,
  //         message: url,
  //         me: "you",
  //         view: 'chat',
  //         date: new Date().toString(),
  //         type: 'image',
  //         read: 'unread',
  //       }
  //       this.afDB.database.ref('/messages').child(this.authService.user?.uid).child(this.userId).push(messages).then((snap) => {
  //         const keys = snap.key;
  //         snap.update({
  //           key: keys
  //         }).then(() => {
  //           this.afDB.database.ref('/messages/').child(this.userId).child(this.authService.user?.uid).push(messages).then((snap) => {
  //             snap.update({
  //               key: keys
  //             })
  //             // for the conversation
  //             resolve(true);
  //             //message = '';
  //             this.afDB.database.ref('conversations').child(this.authService.user?.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
  //               const res = snapshot.val();
  //               if (res != null) {
  //                 const store = Object.keys(res)
  //                 this.afDB.database.ref('conversations').child(this.authService.user?.uid).child(store[0]).remove().then(() => {
  //                   //send the conversation to the user base on the ID
  //                   this.afDB.database.ref('conversations').child(this.authService.user?.uid).push(conversation).then(() => {
  //                     // find the other user base on the user recieve
  //                     this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(this.authService.user?.uid).once('value', snapshot => {
  //                       const res = snapshot.val()
  //                       if (res != null) {
  //                         const store = Object.keys(res)
  //                         this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
  //                           this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
  //                             resolve(true);
  //                           })
  //                         }).catch((err) => {
  //                           reject(err);
  //                         })
  //                       } else {
  //                         this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
  //                           resolve(true);
  //                         })
  //                       }

  //                     }).catch((err) => {
  //                       reject(err);
  //                     })
  //                   })

  //                 }).catch((err) => {
  //                   reject(err);
  //                 })
  //               } else {
  //                 this.afDB.database.ref('conversations').child(this.authService.user?.uid).push(conversation).then(() => {
  //                   this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
  //                     const res = snapshot.val();
  //                     if (res != null) {
  //                       const store = Object.keys(res)
  //                       this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
  //                         this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
  //                           resolve(true);
  //                         })
  //                       }).catch((err) => {
  //                         reject(err);
  //                       })
  //                     } else {
  //                       this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
  //                         resolve(true);
  //                       })
  //                     }
  //                   }).catch((err) => {
  //                     reject(err);
  //                   })
  //                 })
  //               }
  //             }).catch((err) => {
  //               reject(err);
  //             })
  //           })
  //         })

  //       }).then(() => {
  //         // mburger
  //         // // play the when completed send
  //         // this.nativeAudio.play('send')
  //       })
  //     });
  //   }
  // }

  private uploadImageFromURL(url) {
    // console.log('ConversationComponent#uploadImageFromURL; url', url);

    return new Promise((resolve) => {
      const imgBlob = this.imgURItoBlob(url);
      const metadata = {
        'contentType': imgBlob.type
      };

      const ref = this.afstorage.ref('/messaging/' + this.authService.user?.uid + this.generateFilename())
      const task = ref.put(imgBlob, metadata)
      task.snapshotChanges().pipe(
        finalize(async () => {
          ref.getDownloadURL().subscribe((url) => {

            this.sendMessage('image', url).then(() => { resolve(true); } );
          })
        })
      ).subscribe()
    })
  }

  // this handle the upload to the firebase
  // it handle the selection from the image after will be upload to firebase storage
  // also will be return the download url
  uploadPhotoMessage(sourceType) {
    // return new Promise((resolve, reject) => {
    //   this.chatPhotoOption.sourceType = sourceType;
    //   this.camera.getPicture(this.chatPhotoOption).then((imageData) => {
    //     const url = "data:image/jpeg;base64," + imageData;
    //     const imgBlob = this.imgURItoBlob(url);
    //     const metadata = {
    //       'contentType': imgBlob.type
    //     };

    //     const ref = this.afstorage.ref('/Messaging/' + this.authService.user?.uid + this.generateFilename())
    //     const task = ref.put(imgBlob, metadata)
    //     task.snapshotChanges().pipe(
    //       finalize(async () => {
    //         ref.getDownloadURL().subscribe((url) => {
    //           resolve(url);
    //         })
    //       })
    //     ).subscribe()
    //   })
    // })
  }

  // generate the random Name return to the jpg
  generateFilename() {
    const length = 8;
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  // reduce the quality of the image using Blob convert to data
  imgURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
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
