import { DataObject } from '../models/NarrativeDoc';
import { FC } from 'react';
import { getWSTypeName } from '../utils/stringUtils';
import classes from './DataView.module.scss';

interface Props {
  accessGroup: number;
  dataObjects: DataObject[];
}

const DataView: FC<Props> = ({ accessGroup, dataObjects }) => {
  if (!dataObjects?.length) {
    return (
      <p className={classes.dataview_no_data}>This narrative has no data.</p>
    );
  }

  const rows = dataObjects
    .slice(0, 50)
    .map((obj) => {
      return { ...obj, readableType: getWSTypeName(obj.obj_type) };
    })
    .sort((a, b) => a.readableType.localeCompare(b.readableType));

  return (
    <div className="dataview-row-container">
      {rows.map((row, idx) => (
        <DataViewRow obj={row} key={idx} accessGroup={accessGroup} />
      ))}
    </div>
  );
};

interface DataViewRowProps {
  accessGroup: number;
  obj: DataObject;
}
const DataViewRow: FC<DataViewRowProps> = ({ accessGroup, obj }) => (
  <div className={classes.dataview_row_outer}>
    <div>((Icon will go here))</div>
    <div className={classes.dataview_row_inner}>
      <div className={classes.dataview}>
        <a
          // todo: check if this link will be valid after legacy fixes
          href={`/#dataview/${accessGroup}/${obj.name}`}
          rel="noopener noreferrer"
        >
          {obj.name}
        </a>
      </div>
      <div className={classes.dataview_row_type}>{obj.readableType}</div>
    </div>
  </div>
);

export default DataView;
