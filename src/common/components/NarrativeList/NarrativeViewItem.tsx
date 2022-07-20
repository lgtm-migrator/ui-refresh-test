import { NarrativeListDoc } from '../../types/NarrativeDoc';
import { FC, useEffect } from 'react';
import classes from './NarrativeList.module.scss';
import NarrativeItemDropdown from './NarrativeItemDropdown';
import * as timeago from 'timeago.js';
export interface NarrativeViewItemProps {
  item: NarrativeListDoc;
  idx: number;
  active: boolean;
  showVersionDropdown: boolean;
  onSelectItem?: (idx: number) => void;
  onUpaChange?: (upa: string) => void;
}

const NarrativeViewItem: FC<NarrativeViewItemProps> = ({
  showVersionDropdown,
  onSelectItem,
  onUpaChange,
  active,
  item,
  idx,
}) => {
  const status = active ? 'active' : 'inactive';
  const timeElapsed = timeago.format(item.timestamp);

  // notify upa change once new narrative item is focused on
  useEffect(() => {
    if (active) {
      const { access_group, obj_id, version } = item;
      onUpaChange?.(`${access_group}/${obj_id}/${version}`);
    }
  }, [active, item, onUpaChange]);

  function handleSelectItem(idx: number): void {
    onSelectItem?.(idx);
  }

  function handleVersionSelect(version: number) {
    const { access_group, obj_id } = item;
    onUpaChange?.(`${access_group}/${obj_id}/${version}`);
  }

  return (
    <section key={idx} onClick={() => handleSelectItem(idx)}>
      <div className={`${classes.narrative_item_outer} ${classes[status]}`}>
        <div className={classes.narrative_item_inner}>
          <div className={classes.narrative_item_text}>
            {item.narrative_title || 'Untitiled'}
            {showVersionDropdown && active && (
              <NarrativeItemDropdown
                version={item.version}
                onVersionSelect={(e) => handleVersionSelect(e)}
              ></NarrativeItemDropdown>
            )}
          </div>
          <div className={classes.narrative_item_details}>
            Updated {timeElapsed} by {item.creator}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NarrativeViewItem;
