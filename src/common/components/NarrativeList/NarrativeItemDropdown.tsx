import { FC, useState } from 'react';
import { Dropdown } from '../../components';
import { SelectOption } from '../Select';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import classes from './NarrativeList.module.scss';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

type NarrativeItemDropdownProps = {
  version: number;
  onVersionSelect: (e: number) => void;
  active: boolean;
};
const NarrativeItemDropdown: FC<NarrativeItemDropdownProps> = ({
  version,
  onVersionSelect,
  active,
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
    // rgba(0,0,0,0) in this dropdown is to get rid of a
    // default style where hovering will make it gray
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
            padding: '0',
          }),
          dropdownIndicator: (p) => ({
            background: 'rgba(0,0,0,0)',
            color: active ? '#777' : '#aaa',
            cursor: 'pointer',
          }),
          group: (p) => ({
            padding: '0',
          }),
          control: (p) => ({
            paddingTop: '0',
            paddingBottom: '0',
            // not sure why this one needs !important but it does
            background: 'rgba(0,0,0,0)!important',
          }),
        }}
        onChange={(e) => handleDropdownChange(e as SelectOption)}
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
