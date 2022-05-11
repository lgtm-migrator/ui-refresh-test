import { FC, useState } from 'react';
import { Dropdown } from '../../components';
import { SelectOption } from '../Select';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import classes from './NarrativeList.module.scss';
import { faCheck, faCaretDown } from '@fortawesome/free-solid-svg-icons';

type NarrativeItemDropdownProps = {
  version: number;
  onVersionSelect: (e: number) => void;
};
const NarrativeItemDropdown: FC<NarrativeItemDropdownProps> = ({
  version,
  onVersionSelect,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<number>(version);

  const handleDropdownChange = (event: SelectOption[]) => {
    setSelectedVersion(event[0].value as number);
    onVersionSelect(event[0].value as number);
  };

  const versions = Array(version)
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
              <>
                <span>{'v' + item}</span>
                {item === selectedVersion && (
                  <FAIcon icon={faCheck} style={{ marginLeft: '3rem' }} />
                )}
              </>
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
            v{selectedVersion} of {version}
          </span>
        )}
        <FAIcon icon={faCaretDown} style={{ marginLeft: '5px' }} />
      </Dropdown>
    </div>
  );
};

export default NarrativeItemDropdown;
