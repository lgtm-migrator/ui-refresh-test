import { render } from '@testing-library/react'
import { Preview } from './Preview';
import { getFormattedCells } from '../utils/getFormattedCells';
import { Provider } from 'react-redux';
import { createTestStore } from '../../app/store';

const testCells = [
  {
    metaName: 'an app cell',
    cellType: 'app',
    title: 'an incredible app!',
    subtitle: 'It makes the PIs weep with joy.',
    tag: 'release',
  },
  {
    metaName: 'KBaseGenomes.Genome-1.1',
    cellType: 'data',
    title: 'The entire Genome of Sigourney Weaver',
    subtitle: 'Top secret!! do not share outside of this org.',
    tag: 'beta',
  },
  {
    metaName: 'KBaseSamples.Sample',
    cellType: 'data',
    title: 'Xenomorph Gut Microbiome',
    subtitle: 'Sampled by Weyland-Yutani © 2122',
    tag: 'dev',
  },
  // default icon with nothing in it
  getFormattedCells({ cells: [{}] })[0],
];
test('preview renders', () => {
  const { container } = render(
    <Provider store={createTestStore()}>
      <Preview maxLength={15} wsId={434343} cells={testCells} />
    </Provider>
  );
  expect(container.querySelectorAll('svg').length).toBe(3);
});