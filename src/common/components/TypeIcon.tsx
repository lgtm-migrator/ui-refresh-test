import { FC } from 'react';
import { useAppSelector } from '../hooks';
import { IconInfo } from '../slices/iconSlice';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import './kbase_icons.css';
import classes from './TypeIcon.module.scss';
import {
  IconProp,
  library,
  IconDefinition,
} from '@fortawesome/fontawesome-svg-core';
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
  faCube as IconDefinition,
  faAlignJustify as IconDefinition,
  faTable as IconDefinition,
  faListUl as IconDefinition,
  faSliders as IconDefinition,
  faChartArea as IconDefinition,
  faTableCells as IconDefinition,
  faTableList as IconDefinition,
  faFlask as IconDefinition,
  faBullseye as IconDefinition,
  faCodeFork as IconDefinition,
  faArrowsLeftRight as IconDefinition,
  faGaugeHigh as IconDefinition,
  faBook as IconDefinition
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
