import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DbDataService } from './db-data.service';
import { TreeNode } from '../models/tree-node.model';
import { DatabaseNodeData } from '../models/database-node-data.model';
import { tap } from 'rxjs/operators';
import { TreeLine } from '../models/tree-line.model';
import { Semaphore } from '../../shared/semaphore.model';
import { Crumb } from '../models/crumb.model';

@Injectable()
export class TreeService {

  visibleLines = new BehaviorSubject<TreeLine[]>([]);
  crumbs = new BehaviorSubject<Crumb[]>([]);

  private rootNode: TreeNode;
  private databaseNode: TreeNode;
  private editSem = new Semaphore();
  private projectId: string;

  constructor(private dbDataService: DbDataService) { }

  addChild(id: string): Observable<string> {
    const node = this.rootNode.find(id);
    return node.createChild().pipe(
      tap(() => {
        this.computeVisibleLines();
      })
    );
  }

  collapseAll() {
    this.collapseNodeAll(this.rootNode);
    this.computeVisibleLines();
  }

  delete(id: string) {
    const node = this.rootNode.find(id);
    node.delete().subscribe(() => {
      const parent = node.parentNode;
      parent.children = parent.children.filter(el => el !== node);
      this.computeVisibleLines();
    });
  }

  expandAll() {
    this.expandNodeAll(this.rootNode).then(() => {
      this.computeVisibleLines();
    });
  }

  load(projectId: string) {
    if (projectId === this.projectId) {
      return; // already loaded
    }

    DatabaseNodeData.get(projectId, this.dbDataService).subscribe(nodeData => {
      this.databaseNode = new TreeNode(nodeData, this.dbDataService);
      this.rootNode = this.databaseNode;
      this.computeVisibleLines();
    });
    this.projectId = projectId;
  }

  get lockIdChanged(): Observable<string> {
    return this.editSem.lockIdChanged;
  }

  private collapseNodeAll(node: TreeNode) {
    if (node.isParent()) {
      node.collapse();
      for (const child of node.children) {
        this.collapseNodeAll(child);
      }
    }
  }

  private computeVisibleLine(node: TreeNode, lines: TreeLine[], isLastSibling: boolean[]) {
    const isLastCopy = [...isLastSibling];
    if (isLastCopy.length === 0) {
      isLastCopy.push(true); // if root, then always last sibing
    } else {
      isLastCopy.push(this.isLastSibling(node));
    }
    const line = {
      isLastSibling: isLastCopy,
      isParent: node.isParent(),
      isExpanded: node.isExpanded(),
      isNew: node.isNew(),
      id: node.getObject().id,
      object: node.getObject(),
      type: node.getType()
    };
    lines.push(line);
    for (const [i, childNode] of node.children.entries()) {
      if (node.isParent() && node.isExpanded()) {
        this.computeVisibleLine(childNode, lines, isLastCopy);
      }
    }
  }

  private isLastSibling(node: TreeNode) {
    if (!node || !node.parentNode) {
      return true;
    } else {
      const parent = node.parentNode;
      const idx = parent.children.indexOf(node);
      return idx === parent.children.length - 1;
    }
  }

  private computeCrumbs() {
    const crumbs = [];
    if (this.rootNode !== this.databaseNode) {
      crumbs.push({
        name: this.rootNode.getObject().name,
        id: this.rootNode.getObject().id
      });
      let parent = this.rootNode.parentNode;
      while (parent) {
        crumbs.unshift({
          name: parent.getObject().name,
          id: parent.getObject().id
        });
        parent = parent.parentNode;
      }
    }
    this.crumbs.next(crumbs);
  }

  private computeVisibleLines() {
    const lines = [];
    this.computeVisibleLine(this.rootNode, lines, []);
    this.visibleLines.next(lines);
  }

  private async expandNodeAll(node: TreeNode) {
    if (node.isParent()) {
      await node.expand();
      for (const child of node.children) {
        await this.expandNodeAll(child);
      }
    }
  }

  public releaseLock(id: string) {
    this.editSem.releaseLock(id);
  }

  public requestLock(id: string) {
    this.editSem.requestLock(id);
  }

  public revert(id: string) {
    const node = this.rootNode.find(id);
    if (node.revert()) {
      // structure changed
      this.computeVisibleLines();
    }
  }

  public save(id: string) {
    this.rootNode.find(id).save().subscribe(() => {
      this.computeVisibleLines();
    });
  }

  public setRoot(id: string) {
    const node = this.databaseNode.find(id);
    this.rootNode = node;
    this.computeVisibleLines();
    this.computeCrumbs();
  }

  public toggle(id: string) {
    this.rootNode.find(id).toggle().then(() => {
      this.computeVisibleLines();
    });
  }
}
