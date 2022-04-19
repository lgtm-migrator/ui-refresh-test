import { useState } from 'react';
import classes from './NarrativeList.module.scss';
import NarrativeViewItem from './NarrativeViewItem';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

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
  showVersionDropdown: boolean;
  itemsRemaining: number;
  hasMoreItems: boolean;
  loading: boolean;
  onSelectItem?: (upa: string) => void;
  onLoadMoreItems?: () => void;
  selected: string;
  selectedIdx?: number;
  sort?: string; // do we need it
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

  if (!props.items.length) {
    if (props.loading) {
      return (
        <div className={classes.narrative_list_loading_outer}>
          <div className={classes.narrative_list_loading_inner}>
            <FAIcon
              icon={faCog}
              spin={true}
              style={{ marginRight: '5px' }}
            ></FAIcon>
            Loading...
          </div>
        </div>
      );
    }
    return (
      <div className={classes.narrative_list_loading_outer}>
        <p className={classes.narrative_list_loading_inner}>
          No results found.
        </p>
      </div>
    );
  }

  function hasMoreButton() {
    const { itemsRemaining, hasMoreItems, loading, onLoadMoreItems } = props;
    if (!hasMoreItems) {
      return <span className={classes.list_footer}>No more results.</span>;
    }
    if (loading) {
      return (
        <span className={classes.list_footer}>
          <FAIcon
            icon={faCog}
            spin={true}
            style={{ marginRight: '5px' }}
          ></FAIcon>
          Loading...
        </span>
      );
    }
    return (
      <span
        className={`${classes.list_footer} ${classes.link_action}`}
        onClick={onLoadMoreItems}
      >
        Load more ({itemsRemaining} remaining)
      </span>
    );
  }

  return (
    <>
      {props.items.map((item, idx) => {
        return (
          <NarrativeViewItem
            key={idx}
            item={item}
            idx={idx}
            selected={upaKey(item.access_group, item.obj_id, item.version)}
            active={idx === selectedIdx}
            selectItem={(idx) => setSelectedIdx(idx)}
            upaChange={(upa) => props.onSelectItem?.(upa)}
            showVersionDropdown={props.showVersionDropdown}
          ></NarrativeViewItem>
        );
      })}
      {hasMoreButton()}
    </>
  );
}

export default NarrativeList;
