import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createTestStore } from '../../app/store';
import TypeIcon from './TypeIcon';

test('TypeIcon renders FontAwesome SVG elements', () => {
  // this is only testing for svg elements, not kbase icons
  const { container } = render(
    <Provider store={createTestStore()}>
      <TypeIcon objType="Assembly" />
    </Provider>
  );
  const el = container.querySelector('div > span');
  expect(el?.hasChildNodes()).toBeTruthy();
  expect(el?.firstChild instanceof SVGElement).toBeTruthy();
  const svg = document.querySelector('svg');
  expect(svg).not.toBeNull();
  expect(svg?.getAttribute('data-icon')).toBe('align-justify');
  expect(svg?.getAttribute('data-prefix')).toBe('fas');
});

test('TypeIcon renders KBase custom Icons', () => {
  // test icons specificaly coming from kbase_icons.css
  const { container } = render(
    <Provider store={createTestStore()}>
      <TypeIcon objType="Genome" />
    </Provider>
  );
  const el = container.querySelector('div > span');
  expect(el?.hasChildNodes()).toBeTruthy();
  expect(el?.firstChild instanceof HTMLSpanElement).toBeTruthy();
  const span = container.querySelector('span.icon');
  expect(span).not.toBeNull();
  expect(span).toHaveClass('icon-genome');
});

test('TypeIcon formats KBase type strings correctly', () => {
  const { container } = render(
    <Provider store={createTestStore()}>
      <TypeIcon objType="KBaseMatrices.TaxonomicMatrix" />
      <TypeIcon objType="TaxonomicMatrix" />
      <TypeIcon objType="taxonomicmatrix" />
      <TypeIcon objType="KBaseMatrices.TaxonomicMatrix-3.0" />
      <TypeIcon objType="tAxOnOmIcMaTrIx" />
    </Provider>
  );
  const svgs = container.querySelectorAll('svg');
  expect(svgs.length).toBe(5);
  svgs.forEach((svg) => {
    // they should all point to the same svg class
    expect(svg?.getAttribute('data-icon')).toBe('table');
    expect(svg?.getAttribute('data-prefix')).toBe('fas');
  });
});

test('TypeIcon has fallback for unknown data types', () => {
  const { container } = render(
    <Provider store={createTestStore()}>
      <TypeIcon objType="KBaseBetaSequences.CeleryMan-4d3d3d3" />
    </Provider>
  );
  const el = container.querySelector('div > span');
  expect(el?.hasChildNodes()).toBeTruthy();
  expect(el?.firstChild instanceof SVGElement).toBeTruthy();
  const svg = document.querySelector('svg');
  expect(svg).not.toBeNull();
  expect(svg?.getAttribute('data-icon')).toBe('file');
  expect(svg?.getAttribute('data-prefix')).toBe('fas');
});
