import { Injectable } from '@angular/core';
import { DatabaseNodeData } from '../models/database-node-data.model';
import { DbDataService } from './db-data.service';
import { Database } from '../models/database.model';
import { CollectionNodeData } from '../models/collection-node-data.model';
import { BehaviorSubject } from 'rxjs';
import { Collection } from '../models/collection.model';
import { map } from 'rxjs/operators';

@Injectable()
export class CascadeService {
  private projectId: string;
  private database: Database;

  collections = new BehaviorSubject<Collection[]>([]);

  constructor(private dbDataService: DbDataService) { }

  load(projectId: string) {
    if (projectId === this.projectId) {
      return; // already loaded
    }

    // Load database node to get database id
    DatabaseNodeData.get(projectId, this.dbDataService).subscribe(nodeData => {
      this.database = nodeData.getObject();
      // Use database id to get collections
      CollectionNodeData.getSiblings(this.database.id, this.dbDataService)
        .pipe(
          map(nodes => {
            return nodes.map(node => node.getObject());
          })
        )
        .subscribe(collections => {
          this.collections.next(collections);
        });
    });
    this.projectId = projectId;
  }
}
