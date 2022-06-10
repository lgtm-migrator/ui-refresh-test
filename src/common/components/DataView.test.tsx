import { render, screen } from '@testing-library/react';
import Dataview from './DataView';
import { Provider } from 'react-redux';
import { createTestStore } from '../../app/store';

const testDataObjects = [
  {
    name: 'fake genome',
    obj_type: 'KBaseGenomes.Genome-1.0',
  },
  {
    name: 'FBA_model_6000',
    obj_type: 'KBaseFBA.FBAModel',
  },
  {
    name: 'metagenome_200000000',
    obj_type: 'Communities.Metagenome-2.0',
  },
  {
    name: 'ridiculous_fake_type_that_shouldnt_exist',
    obj_type: 'KBaseMuppets.Beeker-6.0',
  },
];

test('Dataview renders', () => {
  const { container } = render(
    <Provider store={createTestStore()}>
      <Dataview accessGroup={42} dataObjects={testDataObjects} />
    </Provider>
  );
  expect(container.querySelectorAll('a').length).toBe(4);
  // should only render 1 faIcon
  expect(container.querySelectorAll('svg').length).toBe(1);
  // should render 3 kbase icons
  expect(container.querySelectorAll('span.icon').length).toBe(3);
  // tests that object type is formatted from unreadable type
  expect(screen.getByText(/FBA Model/)).toBeInTheDocument();
  const firstAnchor = container.querySelector('a');
  expect(firstAnchor?.getAttribute('href')).toBe(
    '/#dataview/42/ridiculous_fake_type_that_shouldnt_exist'
  );
  // test that types are sorted alphabetically by readable type
  const readableTypes = screen.getAllByTestId('readable-type');
  const readableTypeCompare = ['Beeker', 'FBA Model', 'Genome', 'Metagenome'];
  readableTypes.forEach((readableType, idx) => {
    expect(readableType.textContent).toBe(readableTypeCompare[idx]);
  });
});

test('Dataview renders empty message', () => {
  const { container } = render(
    <Provider store={createTestStore()}>
      <Dataview accessGroup={42} dataObjects={[]} />
    </Provider>
  );
  expect(container.firstChild instanceof HTMLParagraphElement).toBeTruthy();
  expect(screen.getByText('This narrative has no data.')).toBeInTheDocument();
});
