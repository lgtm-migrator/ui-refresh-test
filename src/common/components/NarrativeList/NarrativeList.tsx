import { useState } from 'react';

// import * as timeago from 'timeago.js';
import NarrativeViewItem from './NarrativeViewItem';

export interface NarrativeDoc {
  access_group: number;
  cells: Array<Cell>;
  copied: boolean | null;
  creation_date: string;
  creator: string;
  data_objects: Array<DataObject>;
  is_narratorial: boolean;
  is_public: boolean;
  is_temporary: boolean;
  modified_at: number;
  narrative_title: string;
  obj_id: number;
  obj_name: string;
  obj_type_module: string;
  obj_type_version: string;
  owner: string;
  shared_users: Array<string>;
  tags: Array<string>;
  timestamp: number;
  total_cells: number;
  version: number;
}

export interface Cell {
  desc: string;
  cell_type: string;
  count?: number;
}

export interface DataObject {
  name: string;
  obj_type: string;
  readableType: string;
}

interface NarrativeListProps {
  category: string;
  items: Array<NarrativeDoc>;
  loading: boolean;
  onSelectItem?: (upa: string) => void;
  pageSide: number;
  selected: string;
  selectedIdx?: number; // do we need it
  sort?: string; // do we need it
  totalItems: number;
}

export interface SelectItemEvent {
  upa?: string;
  idx: number;
}

const upaKey = (id: number, obj: number, ver: number) => `${id}/${obj}/${ver}`;

function NarrativeList(props: NarrativeListProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(
    props.selectedIdx ?? -1
  );
  return (
    <>
      {props.items.map((item, idx) => {
        return (
          <NarrativeViewItem
            key={idx}
            item={item}
            idx={idx}
            selected={upaKey(item.access_group, item.obj_id, item.version)}
            category={props.category}
            active={idx === selectedIdx}
            selectItem={(idx) => setSelectedIdx(idx)}
            upaChange={(upa) => props.onSelectItem?.(upa)}
          ></NarrativeViewItem>
        );
      })}
    </>
  );
}

export default NarrativeList;
