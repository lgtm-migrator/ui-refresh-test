import { FC, ReactNode } from 'react';
import classes from './Select.module.scss';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';

export interface SelectOption {
  label: ReactNode;
  value: string | number; // check if setting "string | number" is kosher
  icon?: ReactNode;
}

interface SelectProps extends ReactSelectProps<SelectOption> {
  horizontalMenuAlign?: 'left' | 'right';
}

export const Select: FC<SelectProps> = (props) => {
  // Detect how to format options based on if they have icons
  const hasIcons = (props.options ?? []).some((optionOrGroup) => {
    if ('options' in optionOrGroup) {
      return optionOrGroup.options.some((option) => option.icon);
    }
    return optionOrGroup.icon;
  });

  // Add right-aligned class if needed
  const classNames = [classes['react-select'], props.className];
  if (props.horizontalMenuAlign === 'right') {
    classNames.push(classes['react-select--right']);
  }

  return (
    <ReactSelect
      {...props}
      formatOptionLabel={(data) => {
        return (
          <span className={classes.option_content}>
            {hasIcons && (
              <span className={classes.option_content_icon}>{data.icon}</span>
            )}
            {data.label}
          </span>
        );
      }}
      className={classNames.join(' ')}
      // The following allows us to override the default styles by using global
      // classes prefixed with the below
      classNamePrefix={'react-select'}
    />
  );
};
