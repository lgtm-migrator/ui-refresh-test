import { useAppDispatch, useAppSelector } from '../hooks';
import { FC, useEffect } from 'react';
import { IconInfo, appIcon, AppTag } from '../slices/iconSlice';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import {
  IconProp,
  library,
  IconDefinition,
} from '@fortawesome/fontawesome-svg-core';
import { faCube, faSquare, faSpinner } from '@fortawesome/free-solid-svg-icons';
import classes from './AppCellIcon.module.scss';

library.add(
  faCube as IconDefinition,
  faSquare as IconDefinition,
  faSpinner as IconDefinition
);

interface AppIconProps {
  appId: string;
  appTag: AppTag;
}

const AppCellIcon: FC<AppIconProps> = ({ appId, appTag }) => {
  const dispatch = useAppDispatch();
  const icon: IconInfo = useAppSelector(
    (state) =>
      state.icons.appIconCache[appTag]?.[appId] || state.icons.loadingIcon
  );
  useEffect(() => {
    dispatch(appIcon({ appId, appTag }));
  });

  const loading = icon.icon === 'spinner';

  if (icon.isImage) {
    return (
      <span>
        <img
          height="40"
          src={icon.url}
          style={{ maxWidth: '2.5em', maxHeight: '2.5em', margin: 0 }}
          width="40"
          alt={icon.icon}
        />
      </span>
    );
  }
  // anything thats not an image will be the loading icon or the default icon
  return (
    <div
      className={classes.loaded_icon_outer}
      style={{ backgroundColor: icon.color }}
    >
      <FAIcon
        className={classes.loaded_icon_inner}
        icon={icon.icon as IconProp}
        spin={loading}
        size="lg"
        inverse
      />
    </div>
  );
};

export default AppCellIcon;
