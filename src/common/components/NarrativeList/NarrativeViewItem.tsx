import { NarrativeDoc } from './NarrativeList';
import { FC, useEffect } from 'react';
import classes from './NarrativeList.module.scss';
import NarrativeItemDropdown from './NarrativeItemDropdown';
/* eslint-disable @typescript-eslint/no-var-requires */
const timeago = require('timeago.js');
export interface NarrativeViewItemProps {
  item: NarrativeDoc;
  idx: number;
  selected: string; // the selected upa
  category: string;
  active: boolean; // needs to be implemented
  selectItem: (idx: number) => void;
  upaChange: (upa: string) => void;
}

const NarrativeViewItem: FC<NarrativeViewItemProps> = ({
  active,
  item,
  category,
  idx,
  upaChange,
  selectItem,
}) => {
  const status = active ? 'active' : 'inactive';
  const timeElapsed = timeago.format(item.timestamp);

  // notify upa change once new narrative item is focused on
  useEffect(() => {
    if (active) {
      const { access_group, obj_id, version } = item;
      upaChange(`${access_group}/${obj_id}/${version}`);
    }
  }, [active, item, upaChange]);

  function handleSelectItem(idx: number): void {
    selectItem(idx);
  }

  function handleVersionSelect(version: number) {
    const { access_group, obj_id } = item;
    upaChange(`${access_group}/${obj_id}/${version}`);
  }

  return (
    <section key={idx} onClick={() => handleSelectItem(idx)}>
      <div className={`${classes.narrative_item_outer} ${classes[status]}`}>
        <div className={classes.narrative_item_inner}>
          <div className={classes.narrative_item_text}>
            {item.narrative_title || 'Untitiled'}
            {category === 'own' && (
              <NarrativeItemDropdown
                version={item.version}
                onVersionSelect={(e) => handleVersionSelect(e)}
                active={active}
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
