import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as timeago from 'timeago.js';
import { NarrativeListDoc } from '../../../common/types/NarrativeDoc';
import classes from './NarrativeList.module.scss';
import NarrativeItemDropdown from './NarrativeItemDropdown';

export interface NarrativeViewItemProps {
  idx: number;
  item: NarrativeListDoc;
  showVersionDropdown: boolean;
  onSelectItem?: (idx: number) => void;
  onUpaChange?: (upa: string) => void;
}

const NarrativeViewItem: FC<NarrativeViewItemProps> = ({
  idx,
  item,
  onUpaChange,
  showVersionDropdown,
}) => {
  const { access_group, obj_id, version } = item;
  const upa = `${access_group}/${obj_id}/${version}`;
  const { id, obj, ver } =
    useParams<{ id: string; obj: string; ver: string }>();
  const selectedAccessGroup = id ? id : null;
  const selectedObjId = obj ? obj : null;
  const selectedVersion = ver ? ver : null;
  const active =
    access_group.toString() === selectedAccessGroup &&
    obj_id.toString() === selectedObjId &&
    selectedVersion;
  const status = active ? 'active' : 'inactive';
  // Note: timeago expects milliseconds
  const timeElapsed = timeago.format(item.timestamp * 1000);

  // notify upa change once new narrative item is focused on
  useEffect(() => {
    if (active) {
      onUpaChange?.(upa);
    }
  }, [active, onUpaChange, upa]);

  function handleVersionSelect(version: number) {
    onUpaChange?.(`${access_group}/${obj_id}/${version}`);
  }

  /*
  const prefix = '/' + (category !== 'own' ? `${category}/` : '');
  console.log(keepParams(prefix + `${upa}/`)); // eslint-disable-line no-console
  */
  console.log({ upa, selected: active }); // eslint-disable-line no-console
  return (
    <section key={idx}>
      <div className={`${classes.narrative_item_outer} ${classes[status]}`}>
        <div className={classes.narrative_item_inner}>
          <div className={classes.narrative_item_text}>
            <div>
              {item.narrative_title || 'Untitiled'} {upa}
            </div>
            {showVersionDropdown && active ? (
              <NarrativeItemDropdown
                narrative={null}
                version={active ? +selectedVersion : item.version}
                versionLatest={item.version}
                onVersionSelect={(e) => handleVersionSelect(e)}
              />
            ) : (
              <div className={classes.dropdown_wrapper}></div>
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
