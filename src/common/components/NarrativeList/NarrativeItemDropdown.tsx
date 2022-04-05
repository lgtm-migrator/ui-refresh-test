import { FC, useState } from 'react';
import { Dropdown } from '../../components';
import { SelectOption } from '../Select';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import classes from './NarrativeList.module.scss';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

type NarrativeItemDropdownProps = {
  version: number;
  onVersionSelect: (e: number) => void;
};
const NarrativeItemDropdown: FC<NarrativeItemDropdownProps> = ({
  version,
  onVersionSelect,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<number>(version);

  const handleDropdownChange = (event: SelectOption) => {
    setSelectedVersion(event.value as number);
    onVersionSelect(event.value as number);
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
            label: 'v' + item,
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
        menuPlacement="auto"
        menuPosition="fixed"
        styles={{
          option: (p) => ({
            ...p,
            minWidth: '100px',
            color: 'black',
            display: 'inline-block',
            textAlign: 'center',
          }),
        }}
        onChange={(e) => handleDropdownChange(e as SelectOption)}
      >
        v{selectedVersion} of {version}{' '}
        <FAIcon icon={faCaretDown} style={{ marginLeft: '5px' }} />
      </Dropdown>
    </div>
  );
};

export default NarrativeItemDropdown;
