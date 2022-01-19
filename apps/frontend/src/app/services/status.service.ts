/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { DataService } from './../services/data.service';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(
    public dataService : DataService,
    public afDB: AngularFireDatabase,
    public authService: AuthService
  ) { }

  view(key) {
    return new Promise((resolve, reject) => {
      this.dataService.postView(key).valueChanges().pipe(take(1)).subscribe((view) => {
        var views = view;
        if (!views) {
          views = [this.authService.getUser()?.uid];
        } else {
          views.push(this.authService.getUser()?.uid);
        }

        this.dataService.postView(key).update(views).then((success) => {
          resolve(true)
        }).catch((error) => {
          reject(false)
        })
      })
    })
  }


  offlineStatus(){
    var promise = new Promise((resolve, reject) => {
      var ref = this.afDB.database.ref('accounts').child( this.authService.getUser().uid )
      ref.onDisconnect().update({
        status:new Date().toString()
      }).then(() =>{
        resolve(true);
      }).catch((err) =>{
        reject(err);
      })
    })
    return promise;
  }

  offlineStatusLog(){
    var promise = new Promise((resolve, reject) => {
    this.afDB.database.ref('accounts').child( this.authService.getUser().uid ).update({
       status: new Date().toString()
     }).then(() =>{
       resolve(true);
     }).catch((err) =>{
       reject(err);
     })
   })
   return promise;
  }

  onlineStatus(){
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('accounts').child( this.authService.getUser().uid ).update({
        status: 'Online'
      }).then(() =>{
        resolve(true);
      }).catch((err) =>{
        reject(err);
      })
    })
    return promise;
  }
}



