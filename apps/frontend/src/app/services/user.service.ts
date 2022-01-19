/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DataService } from './data.service';
import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private dataService: DataService,
    public angularDb: AngularFireDatabase,
    private authService: AuthService
  ) { }

  block(userId, senderId) {
    return new Promise((resolve, reject) => {
      // send the user block to the current database fetch
      // 1 the user will be block id
      // 2 the current userId
      // this handle for the only current fetch user ID
      this.dataService.postuserBock(userId).valueChanges().pipe(take(1)).subscribe((like) => {
        var likes = like;
        if (!likes) {
          likes = [senderId];
        } else {
          likes.push(senderId);
        }
        this.dataService.postuserBock(userId).set(likes).then((success) => {
          resolve(true)
        }).then(() => {
          // this handel for the sender block will be notify to the who blocks bt others?
          this.dataService.postsenderBock(senderId).valueChanges().pipe(take(1)).subscribe((like) => {
            var likes = like;
            if (!likes) {
              likes = [this.authService.getUser()?.uid];
            } else {
              likes.push(this.authService.getUser()?.uid);
            }
            this.dataService.postsenderBock(senderId).set(likes).then((success) => {
              resolve(true)
            }).then(() => {
              // this handle for the only who block the user by?
              this.dataService.userblocksBy(userId).valueChanges().pipe(take(1)).subscribe((like) => {
                var likes = like;
                if (!likes) {
                  likes = [senderId];
                } else {
                  likes.push(senderId);
                }
                this.dataService.userblocksBy(userId).update(likes).then((success) => {
                  resolve(true)
                }).catch((error) => {
                  reject(false)
                })
              })
            })
          })
        })
      })
    })
  }

// used to block thne system
  unblock(userId, senderId) {
    return new Promise((resolve, reject) => {
      // send the user unblock to the current database fetch
      // 1 the user will be unblock id
      // 2 the current userId
      // this handle for the only current fetch user ID
      // it will be remove from the data block scops
      this.dataService.postuserBock(userId).valueChanges().pipe(take(1)).subscribe((like) => {
        like.splice(like.indexOf(senderId), 1);
        if (like.length) {
          this.angularDb.object('accounts/' + this.authService.getUser()?.uid + '/blocks/').remove();
          this.dataService.postuserBock(userId).set(like).then((success) => {
            resolve(true)
          }).catch((err) => {
            reject(false)
          });
        } else {
          this.angularDb.object('accounts/' + this.authService.getUser()?.uid + '/blocks/').remove();
        }
      })
      // end for the block one: **************************************************
      // this handel for the sender block will be notify to the who blocks bt others?
      this.dataService.postsenderBock(senderId).valueChanges().pipe(take(1)).subscribe((like) => {
        like.splice(like.indexOf(this.authService.getUser()?.uid), 1)
        if (like.length) {
          this.angularDb.object('accounts/' + senderId + '/blocks/').remove();
          this.dataService.postsenderBock(senderId).set(like).then((success) => {
            resolve(true)
          }).catch((err) => {
            reject(false)
          });
        } else {
          this.angularDb.object('accounts/' + senderId + '/blocks/').remove();
        }
      })
      // end of the blobk sender user: ***************************************
      // this handle for the only who block the user by?
      // this is main one for the block of the admin?
      this.dataService.userblocksBy(userId).valueChanges().pipe(take(1)).subscribe((like) => {
        like.splice(like.indexOf(senderId), 1)
        if (like.length) {
          this.angularDb.object('accounts/' + userId + '/userblocks/').remove();
          this.dataService.userblocksBy(userId).update(like).then((success) => {
            resolve(true)
          }).catch((error) => {
            reject(false)
          })
        } else {
          this.angularDb.object('accounts/' + userId + '/userblocks/').remove();
        }

      })
    })
  }

}
