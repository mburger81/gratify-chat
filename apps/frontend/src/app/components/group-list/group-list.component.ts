import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


// custom imports
import { DataService } from '../../shared/services/data.service';


@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  groups: any[];

  constructor(
    public dataService: DataService,
    private router: Router
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

  openChat(key) {
    console.log('GroupListComponent#openChat; key:', key);
  }
}
