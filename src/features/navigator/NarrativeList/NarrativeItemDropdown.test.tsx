import { screen, render, getByTestId, fireEvent } from '@testing-library/react';
import NarrativeItemDropdown from './NarrativeItemDropdown';
import { DropdownProps } from '../../../common/components/Dropdown';
import { GroupBase } from 'react-select';
import { SelectOption, OptionsArray } from '../../../common/components/Select';

// mock react-select with regular HTML select
jest.mock('../Dropdown', () => ({
  __esModule: true,
  Dropdown: ({ options, onChange }: DropdownProps) => {
    function handleChange(event: SelectOption) {
      for (const option of options as OptionsArray) {
        if (
          (option as GroupBase<SelectOption>).options[0].value === event.value
        ) {
          onChange?.([event]);
        }
      }
    }
    return (
      <select
        data-testid="select"
        onChange={(e) =>
          handleChange({
            value: e.target.value,
            label: e.target.value.toString(),
          })
        }
      >
        {(options as OptionsArray).map((option, idx) => (
          <option
            data-testid={(option as GroupBase<SelectOption>).options[0].value}
            key={idx}
            value={(option as SelectOption).value}
            onClick={() =>
              handleChange((option as GroupBase<SelectOption>).options[0])
            }
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  },
}));

test('NarrativeItemDropdown renders', async () => {
  const versionSelectSpy = jest.fn();
  const { container } = render(
    <NarrativeItemDropdown
      narrative={null}
      onVersionSelect={versionSelectSpy}
      version={400}
      versionLatest={400}
    />
  );
  expect(container).toBeTruthy();
  expect(container.querySelector('.dropdown_wrapper')).toBeInTheDocument();
});

test('NarrativeItemDropdown populates right number of versions', () => {
  const { container } = render(
    <NarrativeItemDropdown
      narrative={null}
      onVersionSelect={jest.fn()}
      version={123}
      versionLatest={123}
    />
  );
  const select = screen.getByTestId('select');
  // this tests that the component will render 123 separate items in the dropdown
  expect(select.querySelectorAll('option')).toHaveLength(123);

  expect(container).toBeTruthy();
});

test('NarrativeItemDropdown calls onVersionSelect', () => {
  const versionSelectSpy = jest.fn();
  const { container } = render(
    <NarrativeItemDropdown
      narrative={null}
      onVersionSelect={versionSelectSpy}
      version={42}
      versionLatest={42}
    />
  );
  fireEvent.click(getByTestId(container, '34'));
  // callback should be numeric version
  expect(versionSelectSpy).toHaveBeenCalledWith(34);
  expect(versionSelectSpy).toHaveBeenCalledTimes(1);
});
