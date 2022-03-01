import { FC, ComponentPropsWithRef } from 'react';
import { Select, SelectOption } from './Select';

export type TextSelectOption = SelectOption;

interface TextSelectProps
  extends Omit<ComponentPropsWithRef<typeof Select>, 'onChange'> {
  onChange: (value: TextSelectOption | undefined) => void;
}

export const TextSelect: FC<TextSelectProps> = (props) => {
  return (
    <Select
      {...props}
      isMulti={false}
      onChange={(value) => {
        if (value) {
          // This condition is a type guard to assure only a
          // `SingleValue<SelectOption>` value is passed through
          if ('value' in value) {
            props.onChange(value);
          } else {
            // else condition is empty while `isMulti={false}`
            // would catch `MultiValue<SelectOption>` otherwise
          }
        } else {
          props.onChange(undefined);
        }
      }}
    />
  );
};
