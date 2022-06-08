import { FC } from 'react';
import { useAppSelector } from '../hooks';
import { IconInfo } from '../slices/iconSlice';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import './kbase_icons.css';
import classes from './TypeIcon.module.scss';
import { IconProp, library } from '@fortawesome/fontawesome-svg-core';
import {
  faCube,
  faAlignJustify,
  faTable,
  faListUl,
  faSliders,
  faChartArea,
  faTableCells,
  faTableList,
  faFlask,
  faCodeFork,
  faBullseye,
  faArrowsLeftRight,
  faGaugeHigh,
  faBook,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faCube,
  faAlignJustify,
  faTable,
  faListUl,
  faSliders,
  faChartArea,
  faTableCells,
  faTableList,
  faFlask,
  faBullseye,
  faCodeFork,
  faArrowsLeftRight,
  faGaugeHigh,
  faBook
);

interface TypeIconProps {
  objType: string;
}

const TypeIcon: FC<TypeIconProps> = ({ objType }) => {
  const icon: IconInfo = useAppSelector(
    (state) => state.icons.typeIconInfos[objType] || state.icons.defaultType
  );

  if (icon.icon?.startsWith('icon ')) {
    return (
      <span
        className={classes.type_icon_outer}
        style={{ backgroundColor: icon.color }}
      >
        <span className={icon.icon} />
      </span>
    );
  }

  return (
    <span
      className={classes.type_icon_outer}
      style={{ backgroundColor: icon.color }}
    >
      <FAIcon
        icon={icon.icon as IconProp}
        className={classes.type_icon_inner}
        size="lg"
        inverse
      ></FAIcon>
    </span>
  );
};

export default TypeIcon;
