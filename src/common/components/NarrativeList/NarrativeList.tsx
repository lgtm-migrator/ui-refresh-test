import { useState } from 'react';
import classes from './NarrativeList.module.scss';
import NarrativeViewItem from './NarrativeViewItem';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { NarrativeListDoc } from './NarrativeDoc';

interface NarrativeListProps {
  items: Array<NarrativeListDoc>;
  showVersionDropdown: boolean;
  itemsRemaining: number;
  hasMoreItems: boolean;
  loading: boolean;
  onSelectItem?: (upa: string) => void;
  onLoadMoreItems?: () => void;
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
            onSelectItem={(idx) => setSelectedIdx(idx)}
            onUpaChange={(upa) => props.onSelectItem?.(upa)}
            showVersionDropdown={props.showVersionDropdown}
          ></NarrativeViewItem>
        );
      })}
      {hasMoreButton()}
    </>
  );
}

export default NarrativeList;
