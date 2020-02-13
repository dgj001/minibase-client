import { DbDataService } from '../services/db-data.service';
import { NodeData } from './node-data.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export class TreeNode implements TreeNode {
  indentLevel: number;
  children: TreeNode[] = [];

  private _isExpanded = false;

  constructor(
    private nodeData: NodeData,
    private dbDataService: DbDataService,
    public parentNode?: TreeNode
  ) {
    this.indentLevel = parentNode ? parentNode.indentLevel + 1 : 0;
  }

  collapse() {
    this._isExpanded = false;
  }

  createChild(): Observable<string> {
    if (this.nodeData.needToFecthChildren()) {
      return this.nodeData.fetchChildren()
        .pipe(map(nodes => {
          this.children = [];
          for (const node of nodes) {
            this.children.push(new TreeNode(node, this.dbDataService, this));
          }
          this._isExpanded = true;
          const newData = this.nodeData.createChild();
          this.children.push(new TreeNode(newData, this.dbDataService, this));
          return newData.getObject().id;
        }));
    } else {
      const newData = this.nodeData.createChild();
      this.children.push(new TreeNode(newData, this.dbDataService, this));
      this._isExpanded = true;
      return of(newData.getObject().id);
    }
  }

  delete(): Observable<boolean> {
    return this.nodeData.delete();
  }

  expand(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this._isExpanded && this.nodeData.needToFecthChildren()) {
        return this.nodeData.fetchChildren()
          .subscribe(nodes => {
            this.children = [];
            for (const node of nodes) {
              this.children.push(new TreeNode(node, this.dbDataService, this));
            }
            this._isExpanded = true;
            resolve(true);
          });
      } else {
        this._isExpanded = true;
        resolve(true);
      }
    });
  }

  find(id: string): TreeNode {
    if (this.nodeData.getObject().id === id) {
      return this;
    } else {
      let node: TreeNode;
      for (const child of this.children) {
        node = child.find(id);
        if (node) {
          break;
        }
      }
      return node;
    }
  }

  getObject(): any {
    return this.nodeData.getObject();
  }

  getType(): string {
    return this.nodeData.getType();
  }

  isExpanded(): boolean {
    return this._isExpanded;
  }

  isNew(): boolean {
    return this.nodeData.isNew();
  }

  isParent(): boolean {
    return this.children.length > 0 || this.nodeData.needToFecthChildren();
  }

  revert(): boolean {
    if (this.nodeData.isNew()) {
      this.parentNode.children = this.parentNode.children.filter(el => el !== this);
      return true;
    } else {
      this.nodeData.revert();
      return false;
    }
  }

  save(): Observable<boolean> {
    return this.nodeData.save();
  }

  toggle(): Promise<boolean> {
    if (!this._isExpanded) {
      return this.expand();
    } else {
      this.collapse();
      return Promise.resolve(true);
    }
  }
}
