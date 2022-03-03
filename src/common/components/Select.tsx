import { FC, ReactNode, useState, useEffect } from 'react';
import ReactSelect, {
  GroupBase,
  MultiValue,
  OptionsOrGroups,
  SingleValue,
  Props as ReactSelectProps,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import classes from './Select.module.scss';

export interface SelectOption {
  label: ReactNode;
  value: string;
  icon?: ReactNode;
}

interface SelectProps {
  horizontalMenuAlign?: 'left' | 'right';
  components?: ReactSelectProps<SelectOption>['components'];
  options:
    | OptionsOrGroups<SelectOption, GroupBase<SelectOption>>
    | ((
        inputValue: string
      ) => Promise<OptionsOrGroups<SelectOption, GroupBase<SelectOption>>>);
  className?: string;
  onChange?: (value: SelectOption[]) => void;
  value?: SingleValue<SelectOption> | MultiValue<SelectOption>;
  multiple?: boolean;
  disabled?: boolean;
  clearable?: boolean;
}

function optsHaveIcons(
  opts: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>
): boolean {
  return opts.some((optionOrGroup) => {
    if ('options' in optionOrGroup) {
      return optsHaveIcons(optionOrGroup.options);
    }
    return !!optionOrGroup.icon;
  });
}

export const Select: FC<SelectProps> = (props) => {
  // Detect how to format options based on if they have icons
  const defaultHasIcons =
    typeof props.options !== 'function' && optsHaveIcons(props.options);
  const [hasIcons, setHasIcons] = useState(defaultHasIcons);

  useEffect(() => {
    // Detect if static option icons have changed
    // needed so we can deal with icons set ansynchronously
    if (typeof props.options !== 'function') {
      setHasIcons(optsHaveIcons(props.options));
    }
  }, [props.options]);

  // Add right-aligned class if needed
  const classNames = [classes['react-select'], props.className ?? ''];
  if (props.horizontalMenuAlign === 'right') {
    classNames.push(classes['react-select--right']);
  }

  const handleChange =
    props.onChange ??
    (() => {
      /* noop */
    });

  // Common between sync/async
  const commonProps = {
    value: props.value,
    isMulti: props.multiple,
    isDisabled: props.disabled,
    isClearable: props.clearable,
    components: props.components,
    formatOptionLabel: (data: SelectOption) => {
      return (
        <span className={classes.option_content}>
          {hasIcons && (
            <span className={classes.option_content_icon}>{data.icon}</span>
          )}
          {data.label}
        </span>
      );
    },
    onChange: (
      options: SingleValue<SelectOption> | MultiValue<SelectOption>
    ) => {
      if (options && 'value' in options) {
        // one option returned
        handleChange([options]);
      } else {
        // multiple/no options returned
        if (options) {
          handleChange([...options]);
        } else {
          handleChange([]);
        }
      }
    },
  };
  if (typeof props.options !== 'function') {
    // Synchrnous
    return (
      <ReactSelect
        {...commonProps}
        options={props.options}
        className={classNames.join(' ')}
        // This allows us to override the default styles by using global
        // classes prefixed with the below
        classNamePrefix={'react-select'}
      />
    );
  } else {
    // Asynchrnous
    // Could support pagination here if react-select-async-paginate was added
    return (
      <AsyncSelect
        {...commonProps}
        loadOptions={async (inputValue: string) => {
          if (typeof props.options !== 'function') return props.options;
          const newOpts = await props.options(inputValue);
          setHasIcons(optsHaveIcons(newOpts));
          return newOpts;
        }}
        defaultOptions={true}
        className={classNames.join(' ')}
        // This allows us to override the default styles by using global
        // classes prefixed with the below
        classNamePrefix={'react-select'}
      />
    );
  }
};
