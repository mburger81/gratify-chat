import { Injectable, OnInit } from '@angular/core';
// import { addDoc, Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';


// custom imports
import { Message } from './message';
import { User } from './user';
import { AuthService } from '../auth/auth.service';



@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(private auth: AuthService, private afs: AngularFirestore) { }


  addChatMessage(msg) {
    const user = this.auth.getUser();

    return this.afs.collection('messages').add({
      msg: msg,
      from: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  getChatMessages(): Observable<Message[]> {
    let users = [];

    return this.getUsers()
                  .pipe(
                    switchMap(
                      (res) => {
                        users = res;
                        return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
                      }
                    ),
                    map(
                     (messages) => {
                        for (let m of messages) {
                          m.fromName = this.getUserForMsg(m.from, users);
                          m.myMsg = this.auth.getUser().uid === m.from;
                        }
                        return messages;
                      }
                    )
                  );
  }

  private getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;

  }

  private getUserForMsg(msgFromId, users: User[]): string {
    for (let usr of users) {
      if (usr.uid == msgFromId) {
        return usr.email;
      }
    }
    return 'Deleted';
  }
}
