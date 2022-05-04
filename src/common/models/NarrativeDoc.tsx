export interface NarrativeDoc {
  access_group: number;
  cells: Array<Cell>;
  copied: boolean | null;
  creation_date: string;
  creator: string;
  data_objects: Array<DataObject>;
  is_narratorial: boolean;
  is_public: boolean;
  is_temporary: boolean;
  modified_at: number;
  narrative_title: string;
  obj_id: number;
  obj_name: string;
  obj_type_module: string;
  obj_type_version: string;
  owner: string;
  shared_users: Array<string>;
  tags: Array<string>;
  timestamp: number;
  total_cells: number;
  version: number;
}

export interface Cell {
  desc: string;
  cell_type: string;
  count?: number;
}

export interface DataObject {
  name: string;
  obj_type: string;
  readableType: string;
}

// for NarrativeList and children components
export type NarrativeListDoc = Pick<
  NarrativeDoc,
  | 'timestamp'
  | 'access_group'
  | 'obj_id'
  | 'version'
  | 'narrative_title'
  | 'creator'
>;
