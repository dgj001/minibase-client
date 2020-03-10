import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Database } from 'src/app/core/models/database.model';
import { BaseLineComponent } from '../base-line/base-line.component';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'app-database-line',
  templateUrl: './database-line.component.html',
  styleUrls: [
    './database-line.component.scss',
    './../base-line/base-line.component.scss' // parent stylesheet
  ]
})
export class DatabaseLineComponent extends BaseLineComponent implements OnInit, OnDestroy {
  database: Database;

  treeSubs: Subscription;

  constructor(treeService: TreeService) {
    super(treeService);
  }

  ngOnInit() {
    this.database = this.line.object;

    this.treeSubs = this.treeService.lockIdChanged.subscribe(id => {
      this.lockId = id;
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.treeSubs.unsubscribe();
  }
}
