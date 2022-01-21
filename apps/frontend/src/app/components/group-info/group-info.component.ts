import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';


// custom imports
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';


@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent implements OnInit {

  private groupId: any;
  group = <any>{};
  private isAdmin: any;


  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    // custom imports
    private authService: AuthService,
    private dataService: DataService
  ) {
    // get groupId
    this.groupId = this.actRoute.snapshot.paramMap.get('key');
  }
  ngOnInit() {
    this.dataService.groups(this.groupId).valueChanges().subscribe((group) => {
      this.group = group;
      if (group.admin) {
        const index = _.indexOf(group.admin, this.authService.user?.uid);
        if (index > - 1) {
          this.isAdmin = true;
        }
      }
    });
  }

}
