/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSelector } from 'reselect';
import columnDefs from './Columns/columnDefs';
import { ExtendedColumnDef }  from '../components/GridViewMain';
import frozenColumns from './Columns/frozenColumns';
import hiddenColumns from './Columns/hiddenColumns';
import scrollableColumns from './Columns/scrollableColumns';
import reorderColumn from './Columns/reorderColumn';
import { ActionTypes }  from './actions';


export interface ColumnState {
  columnDefs: ExtendedColumnDef[];
  frozenColumns: number[];
  hiddenColumns: number[];
  scrollableColumns: number[];
  reorderColumn: number;
}

export const columns = (s: ColumnState = initialState(), a: ActionTypes): ColumnState => {
  return ({
    columnDefs: columnDefs(s.columnDefs, a),
    frozenColumns: frozenColumns(s.frozenColumns, a),
    hiddenColumns: hiddenColumns(s.hiddenColumns, a),
    scrollableColumns: scrollableColumns(s.scrollableColumns, a),
    reorderColumn: reorderColumn(s.reorderColumn, a),
  });
};

export default columns;



export const initialState = (): ColumnState => {
  return {
    columnDefs: [],
    frozenColumns: [],
    hiddenColumns: [],
    scrollableColumns: [],
    reorderColumn: 0,
  };
};

export const getColumnDefs = (s: ColumnState): ExtendedColumnDef[] => {
  return s.columnDefs;
};

export const getFrozenColumns = (s: ColumnState): number[] => {
  return s.frozenColumns;
};

export const getScrollableColumns = (s: ColumnState): number[] => {
  return s.scrollableColumns;
};

export const getHiddenColumns = (s: ColumnState): number[] => {
  return s.hiddenColumns;
};

export const getReorderColumn = (s: ColumnState): number => {
  return s.reorderColumn;
};

export const getFrozenColumnDefs = createSelector(
  [getFrozenColumns, getColumnDefs],
  (frozenColumns, columnDefs) => {
    return frozenColumns.map(columnIndex => columnDefs[columnIndex]);
  },
);

export const getScrollableColumnDefs = createSelector(
  [getScrollableColumns, getColumnDefs],
  (scrollableColumns, columnDefs) => {
    return scrollableColumns.map(columnIndex => columnDefs[columnIndex]);
  },
);

export const getReorderColumnDef = createSelector(
  [getReorderColumn, getColumnDefs],
  (reorderColumn, columnDefs) => {
    return [columnDefs[reorderColumn]];
  },
);
