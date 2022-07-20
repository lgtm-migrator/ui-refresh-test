import { DataObject } from '../types/NarrativeDoc';
import { FC } from 'react';
import { getWSTypeName } from '../utils/stringUtils';
import classes from './DataView.module.scss';
import TypeIcon from './TypeIcon';

interface DataViewProps {
  wsId: number;
  dataObjects: DataObject[];
}

const DataView: FC<DataViewProps> = ({ wsId, dataObjects }) => {
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
    <>
      {rows.map((row, idx) => (
        <DataViewRow obj={row} key={idx} wsId={wsId} />
      ))}
    </>
  );
};

interface DataViewRowProps {
  wsId: number;
  obj: DataObject;
}
const DataViewRow: FC<DataViewRowProps> = ({ wsId, obj }) => (
  <div className={classes.dataview_row_outer}>
    <div>
      <TypeIcon objType={obj.obj_type} />
    </div>
    <div className={classes.dataview_row_inner}>
      <div className={classes.dataview}>
        <a href={`/#dataview/${wsId}/${obj.name}`} rel="noopener noreferrer">
          {obj.name}
        </a>
      </div>
      <div data-testid="readable-type" className={classes.dataview_row_type}>
        {obj.readableType}
      </div>
    </div>
  </div>
);

export default DataView;
