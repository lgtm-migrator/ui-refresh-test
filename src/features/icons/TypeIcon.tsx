import { FC } from 'react';
import { useAppSelector } from '../../common/hooks';
import { IconInfo, isFAIcon } from './iconSlice';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import classes from './TypeIcon.module.scss';
interface TypeIconProps {
  objType: string;
}

const TypeIcon: FC<TypeIconProps> = ({ objType }) => {
  let fmtType = objType.includes('.')
    ? objType.split('.')[1].toLowerCase()
    : objType.toLowerCase();
  if (fmtType.includes('-')) {
    fmtType = fmtType.split('-')[0];
  }

  const icon: IconInfo = useAppSelector(
    (state) => state.icons.typeIconInfos[fmtType] || state.icons.defaultType
  );

  if (!isFAIcon(icon.icon)) {
    // if icon is not an FA icon definition then its a kbase css class
    return (
      <span
        className={classes.type_icon_outer}
        style={{ backgroundColor: icon.color }}
      >
        <span
          className={`${classes.icon} ${classes[icon.icon.split(' ')[1]]}`}
        />
      </span>
    );
  }

  return (
    <span
      className={classes.type_icon_outer}
      style={{ backgroundColor: icon.color }}
    >
      <FAIcon
        icon={icon.icon}
        className={classes.type_icon_inner}
        size="lg"
        inverse
      ></FAIcon>
    </span>
  );
};

export default TypeIcon;
