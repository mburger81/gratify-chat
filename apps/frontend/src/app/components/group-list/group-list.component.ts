import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


// custom imports
import { DataService } from '../../shared/services/data.service';
import { LoginService } from '../../shared/services/login.service';


@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  groups: any[];

  constructor(
    private router: Router,
    // custom imports
    public dataService: DataService,
    private loginService: LoginService
  ) { }
  ngOnInit() {

    this.dataService
          .allGroups()
          .valueChanges()
          .subscribe(
            (groups) => {
              this.groups = groups;
            }
          );

  }

  openConversation(key) {
    // console.log('GroupListComponent#openChat; key:', key);
    this.router.navigate(['/dashboard/conversation', { 'key': key }]);
  }

  addGroup() {
    console.log('GroupListComponent#addGroup;');
    this.router.navigate(['/dashboard/new-group']);
  }

  logout() {
    // console.log('GroupListComponent#logout;');

    this.loginService
          .logout()
            .then(() => this.router.navigateByUrl('/login'))
            .catch();
  }
}
