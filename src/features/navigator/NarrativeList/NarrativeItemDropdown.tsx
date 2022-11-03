import { FC, useState } from 'react';
import { generatePath, useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '../../../common/components/Dropdown';
import { SelectOption } from '../../../common/components/Select';
import {
  narrativeSelectedPath,
  narrativeSelectedPathWithCategory,
} from '../../../common/routes';
import classes from './NarrativeList.module.scss';

type NarrativeItemDropdownProps = {
  narrative: string | null;
  onVersionSelect: (e: number) => void;
  version: number;
  versionLatest: number;
};

const NarrativeItemDropdown: FC<NarrativeItemDropdownProps> = ({
  onVersionSelect,
  version,
  versionLatest,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<number>(version);
  /*
    We cannot depend on this to discern the selected narrative. The url may not
specify a valid narrative.
  */
  const { category, id, obj } =
    useParams<{ category: string; id: string; obj: string }>();

  const handleDropdownChange = (event: SelectOption[]) => {
    const upa = `${id}/${obj}/${event[0].value}`;
    console.log({ upa }); // eslint-disable-line no-console
    setSelectedVersion(event[0].value as number);
    onVersionSelect(event[0].value as number);
  };

  const versionPath = (version: number) => {
    const ver = version.toString();
    if (category) {
      return generatePath(narrativeSelectedPathWithCategory, {
        category,
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

  const versions = Array(versionLatest)
    .fill(null)
    .map((_, n) => n + 1)
    .reverse()
    .map((item) => {
      return {
        options: [
          {
            value: item,
            icon: undefined,
            label: (
              <Link to={versionPath(item)}>
                <span>v{item}</span>
                {item === selectedVersion && (
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
        options={versions}
        onChange={(e) => handleDropdownChange(e)}
      >
        {selectedVersion === version ? (
          <span>v{selectedVersion}</span>
        ) : (
          <span>
            v{selectedVersion} of {versionLatest}
          </span>
        )}
        <FAIcon icon={faCaretDown} style={{ marginLeft: '5px' }} />
      </Dropdown>
    </div>
  );
};

export default NarrativeItemDropdown;
