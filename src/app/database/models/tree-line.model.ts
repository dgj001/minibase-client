import { TreeColumn } from './tree-column.model';

export interface TreeLine {
  isLastSibling: boolean[];
  isParent: boolean;
  isExpanded: boolean;
  isNew: boolean;
  id: string;
  object: any;
  type: string;
}
