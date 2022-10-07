import {
  faAlignJustify,
  faTable,
  faListUl,
  faSliders,
  faChartArea,
  faTableCells,
  faTableList,
  faFlask,
  faCodeFork,
  faBullseye,
  faArrowsLeftRight,
  faGaugeHigh,
  faBook,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export interface IconInfo {
  /*
    if IconInfo.icon is a string, it will either be the img src url
    or the kbase css class name, depending on whether its used in an
    AppCellIcon or a TypeIcon.
  */
  icon: string | IconDefinition;
  color: string;
}

export function isFAIcon(
  icon: string | IconDefinition
): icon is IconDefinition {
  return (icon as IconDefinition).icon !== undefined;
}

export const typeIconInfos = {
  assemblyinput: {
    color: '#F44336',
    icon: 'icon icon-reads',
  },
  assembly: {
    color: '#920D58',
    icon: faAlignJustify,
  },
  chromatographymatrix: {
    color: '#E91E63',
    icon: faTable,
  },
  collection: {
    color: '#E91E63',
    icon: faListUl,
  },
  contigset: {
    color: '#3F51B5',
    icon: faAlignJustify,
  },
  domainalignment: {
    color: '#000000',
    icon: faSliders,
  },
  estimatekresult: {
    color: '#000000',
    icon: faChartArea,
  },
  expressionmatrix: {
    color: '#2196F3',
    icon: faTableCells,
  },
  expressionsample: {
    color: '#2196F3',
    icon: faGaugeHigh,
  },
  expressionseries: {
    color: '#2196F3',
    icon: faGaugeHigh,
  },
  fba: {
    color: '#673AB7',
    icon: 'icon icon-metabolism',
  },
  fbamodel: {
    color: '#673AB7',
    icon: 'icon icon-metabolism',
  },
  featureclusters: {
    color: '#AEEA00',
    icon: faTableList,
  },
  featureset: {
    color: '#AEEA00',
    icon: faListUl,
  },
  functionalmatrix: {
    color: '#000000',
    icon: faTable,
  },
  genome: {
    color: '#3F51B5',
    icon: 'icon icon-genome',
  },
  genomeannotation: {
    color: '#920D58',
    icon: 'icon icon-genome',
  },
  genomecomparison: {
    color: '#3F51B5',
    icon: 'icon icon-compare',
  },
  genomeset: {
    color: '#3F51B5',
    icon: faListUl,
  },
  heatmap: {
    color: '#795548',
    icon: faTableCells,
  },
  media: {
    color: '#795548',
    icon: faFlask,
  },
  metagenome: {
    color: '#795548',
    icon: 'icon icon-metagenome',
  },
  network: {
    color: '#795548',
    icon: faCodeFork,
  },
  pairedendlibrary: {
    color: '#795548',
    icon: 'icon icon-reads',
  },
  pangenome: {
    color: '#795548',
    icon: faBullseye,
  },
  phenotypeset: {
    color: '#795548',
    icon: faListUl,
  },
  phenotypesimulationset: {
    color: '#795548',
    icon: faListUl,
  },
  proteomecomparison: {
    color: '#795548',
    icon: faArrowsLeftRight,
  },
  readsset: {
    color: '#795548',
    icon: 'icon icon-reads',
  },
  referenceassembly: {
    color: '#795548',
    icon: faBook,
  },
  singleendlibrary: {
    color: '#795548',
    icon: 'icon icon-reads',
  },
  taxonomicmatrix: {
    color: '#795548',
    icon: faTable,
  },
  taxon: {
    color: '#920D58',
    icon: faTable,
  },
  tree: {
    color: '#795548',
    icon: 'icon icon-tree',
  },
};
