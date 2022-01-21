import { Component, OnInit, Optional } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { IonRouterOutlet, NavController } from '@ionic/angular';


// custom imports
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit {

  group = <any>{};

  private createName = "XXXXXXXX";


  constructor(
    private angularDb: AngularFireDatabase,
    private navCtrl: NavController,
    @Optional() private routerOutlet: IonRouterOutlet,
    // custom imports
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // initialize the image for the group
    this.group = {
      img: 'assets/profile.png'
    };
  }


  newGroup() {
    // return new Promise((resolve) => {
      const messages = [];
      //add system message that group is created
      messages.push({
        date: new Date().toString(),
        userId: this.authService.user?.uid,
        type: 'system',
        message: 'This group has been created by "' + this.createName + '".',
        icon: 'chatbubbles'
      });
      // mburger
      // // Add members of the group
      // const members = [];
      // for (let i = 0; i < this.groupMembers.length; i++) {
      //   //let push the group member to member with only userId
      //   members.push(this.groupMembers[i].userId);
      // }

      // add group information and date
      this.group.dateCreated = new Date().toString(),
      this.group.messages = messages;
      // mburger
      // this.group.members = members;
      // if (this.group.img == '') {
      //   this.group.img = "assets/profile.png";
      // }
      // this.group.name = this.formGroup.value["name"];
      this.group.admin = [ this.authService.user?.uid ];
      this.group.createdBy = this.createName;

      // Lets add to firebase database
      this.angularDb.list('/groups/').push(this.group).then((success) => {
        console.log('NewGroupComponent#newGroup; success', success.key);
        const groupId = success.key;
        //update the key
        success.update({
          key: groupId
        });
        // burger
        // let conversation = {
        //   key: groupId,
        //   me: "me",
        //   // message: 'This group has been created.',
        //   type: 'text',
        //   view: 'group',
        //   // read: 'unread',
        //   date: new Date().toString(),
        // }
        const convasation = {
          key: groupId,
          // message: 'This group has been created.',
          me: "you",
          type: 'text',
          view: 'group',
          // read: 'unread',
          date: new Date().toString(),
        }

        // mburger
        // //add group referenceuser to user;
        // for (let i = 0; i < this.groupMembers.length; i++) {
        //   this.angularDb.object('/accounts/' + this.groupMembers[i].userId + '/groups/' + groupId).update({
        //     messagesRead: 1,
        //     key: groupId
        //   });
        //   this.angularDb.database.ref('conversations').child(this.groupMembers[i].userId).push(convasation).then(() => {
          this.angularDb.database.ref('conversations').child(this.authService.user.uid).push(convasation).then(() => {
            // mburger
            // resolve(true);
            this.routerOutlet.pop();
            // mburger
            // this.navCtrl.pop();
          })
          // .then(() => {

          // })

        // }
      })
    // });
  }
}
