import { FC } from 'react';
import { generatePath, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../../common/hooks';
import { Dropdown } from '../../../common/components/Dropdown';
import { SelectOption } from '../../../common/components/Select';
import {
  narrativeSelectedPath,
  narrativeSelectedPathWithCategory,
} from '../../../common/routes';
import {
  keepParamsForLocation,
  searchParams,
  CategoryStrings,
} from '../common';
import { categorySelected, navigatorSelected } from '../navigatorSlice';
import classes from './NarrativeList.module.scss';

type NarrativeItemDropdownProps = {
  narrative: string;
  onVersionSelect: (e: number) => void;
  version: number;
};

const narrativePath = (parameters: {
  categoryPath: CategoryStrings | null;
  id: string;
  obj: string;
  ver: string;
}) => {
  const { categoryPath, id, obj, ver } = parameters;
  if (categoryPath) {
    return generatePath(narrativeSelectedPathWithCategory, {
      category: categoryPath,
      id,
      obj,
      ver,
    });
  }
  return generatePath(narrativeSelectedPath, {
    id,
    obj,
    ver,
  });
};

const NarrativeItemDropdown: FC<NarrativeItemDropdownProps> = ({
  narrative,
  onVersionSelect,
  version,
}) => {
  const narrativeSelected = useAppSelector(navigatorSelected);
  const categorySet = useAppSelector(categorySelected);
  const [id, obj, ver] = narrative.split('/');
  const versionLatest = +ver;
  const [idSelected, objSelected, versionSelected] = narrativeSelected
    ? narrativeSelected.split('/')
    : [null, null, null];
  const active = idSelected === id && objSelected === obj;
  console.log({ active, narrativeSelected }); // eslint-disable-line no-console
  const handleDropdownChange = (event: SelectOption[]) => {
    const upa = `${id}/${obj}/${event[0].value}`;
    console.log({ upa }); // eslint-disable-line no-console
    onVersionSelect(event[0].value as number);
  };

  const loc = useLocation();
  const keepSearch = keepParamsForLocation({
    location: loc,
    params: searchParams,
  });
  const versionPath = (version: number) => {
    const categoryPath = categorySet !== 'own' ? categorySet : null;
    return keepSearch(
      narrativePath({
        id,
        obj,
        categoryPath,
        ver: version.toString(),
      })
    );
  };

  const versionIsSelected = (
    version: number,
    versionSelected: string | null
  ) => {
    return versionSelected && version === +versionSelected;
  };
  const versionOptions = Array(versionLatest)
    .fill(null)
    .map((_, n) => n + 1)
    .reverse()
    .map((version) => {
      return {
        options: [
          {
            value: version,
            icon: undefined,
            label: (
              <Link to={versionPath(version)}>
                <span>v{version}</span>
                {versionIsSelected(version, versionSelected) && (
                  <FAIcon icon={faCheck} style={{ marginLeft: '3rem' }} />
                )}
              </Link>
            ),
          },
        ],
      };
    });

  return (
    <div className={classes.dropdown_wrapper}>
      <Dropdown
        className={classes.version_dropdown}
        horizontalMenuAlign="right"
        options={versionOptions}
        onChange={(e) => handleDropdownChange(e)}
      >
        {versionIsSelected(version, versionSelected) ? (
          <span>v{versionSelected}</span>
        ) : (
          <span>
            v{versionSelected} of {versionLatest}
          </span>
        )}
        <FAIcon icon={faCaretDown} style={{ marginLeft: '5px' }} />
      </Dropdown>
    </div>
  );
};

export default NarrativeItemDropdown;
