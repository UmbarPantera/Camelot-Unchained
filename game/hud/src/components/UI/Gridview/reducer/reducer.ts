/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import { CSSProperties } from 'react';
import { createSelector } from 'reselect';
import { intersection } from 'lodash';
import settings, * as fromSettings from './settings';
import data, * as fromData from './data';
import layout, * as fromLayout from './layout';
import gridClassnames, * as fromGridClassnames from './gridClassnames';
import columns, * as fromColumns from './columns';
import contextMenu, * as fromContextMenu from './contextMenu';
import measure, * as fromMeasure from './measure';
import { ExtendedColumnDef, ColumnGroupType, SortInfo } from '../components/GridViewMain';
import { ContextMenuItem, AlterContextMenu } from '../components/ContextMenu';
import { ActionTypes } from './actions';

export interface GridViewState {
  settings: fromSettings.SettingState;
  columns: fromColumns.ColumnState;
  data: fromData.DataState;
  gridClassnames: any;
  layout: fromLayout.LayoutState;
  contextMenu: fromContextMenu.ContextMenuState;
  measure: fromMeasure.MeasureState;
  lastAction: ActionTypes;
}

export const reducer = (s: GridViewState = initialState(), a: ActionTypes): GridViewState => {
  const nextData = data(s.data, a, s);
  const nextColumns = columns(s.columns, a);
  return {
    settings: settings(s.settings, a),
    columns: nextColumns,
    data: nextData,
    gridClassnames: gridClassnames(s.gridClassnames, a),
    layout: layout(s.layout, a, s, fromData.getOutputIDs(nextData), nextColumns),
    contextMenu: contextMenu(s.contextMenu, a),
    measure: measure(s.measure, a, s),
    lastAction: a,
  };
};

export default reducer;

export const initialState = (): GridViewState => {
  return {
    settings: fromSettings.initialState(),
    columns: fromColumns.initialState(),
    data: fromData.initialState(),
    gridClassnames: fromGridClassnames.initialState(),
    layout: fromLayout.initialState(),
    contextMenu: fromContextMenu.initialState(),
    measure: fromMeasure.initialState(),
    lastAction: null,
  };
};



export const getHasExpander = (s: GridViewState, columnGroupType: ColumnGroupType): boolean => {
  const hasRowExpansionTemplate = fromSettings.getRowExpansionTemplate(s.settings) ? true : false;
  const hasFrozenColumns = fromColumns.getFrozenColumns(s.columns).length > 0;
  const hasExpander = columnGroupType === ColumnGroupType.Dummy
    ? false
    : columnGroupType === ColumnGroupType.Frozen
      ? hasRowExpansionTemplate
      : !hasFrozenColumns && hasRowExpansionTemplate;
  return hasExpander;
};

export const getLastColumnIndex = (s: GridViewState): number => {
  const scrollableColumns = fromColumns.getScrollableColumns(s.columns);
  if (scrollableColumns) {
    return scrollableColumns[scrollableColumns.length - 1];
  }
  const frozenColumns = fromColumns.getFrozenColumns(s.columns);
  return frozenColumns[frozenColumns.length - 1];
};

export const getTotalPages = (s: GridViewState): number => {
  const outputLength = getOutputIDs(s).length;
  const itemsPerPage = getItemsPerPage(s);
  return Math.ceil(outputLength / itemsPerPage);
};

/*
 *    Data
 */

export const getInput = (s: GridViewState): any[] => {
  return fromData.getInput(s.data);
};

export const getAllRowIDs = (s: GridViewState): string[] => {
  return fromData.getAllRowIDs(s.data);
};

export const getOutputIDs = (s: GridViewState): string[] => {
  return fromData.getOutputIDs(s.data);
};

export const getMultiSort = (s: GridViewState): SortInfo[] => {
  return fromData.getMultiSort(s.data);
};

export const getMultiFilter = (s: GridViewState): string[] => {
  return fromData.getMultiFilter(s.data);
};

export const getGlobalFilter = (s: GridViewState): string => {
  return fromData.getGlobalFilter(s.data);
};

export const getFrozenRowIDs = (s: GridViewState): string[] => {
  return fromData.getFrozenRowIDs(s.data);
};

export const getCurrentPage = (s: GridViewState): number => {
  return fromData.getCurrentPage(s.data);
};


/*
 *    Layout
 */

export const getColumnStyles = (s: GridViewState): CSSProperties[] => {
  return fromLayout.getColumnStyles(s.layout);
};

export const getXScrollPosition = (s: GridViewState): number => {
  return fromLayout.getXScrollPosition(s.layout);
};

export const getYScrollPosition = (s: GridViewState): number => {
  return fromLayout.getYScrollPosition(s.layout);
};

export const getColumnReordering = (s: GridViewState): boolean => {
  return fromLayout.getColumnReordering(s.layout);
};

export const getSelectedRowIDs = (s: GridViewState): string[] => {
  return fromLayout.getSelectedRowIDs(s.layout);
};

export const getExpandedRowIDs = (s: GridViewState): string[] => {
  return fromLayout.getExpandedRowIDs(s.layout);
};

export const getItemsPerPage = (s: GridViewState): number => {
  return fromLayout.getItemsPerPage(s.layout);
};

export const getShowMultiFilters = (s: GridViewState): boolean => {
  return fromLayout.getShowMultiFilters(s.layout);
};

export const getScrollbarWidth = (s: GridViewState): number => {
  return fromLayout.getScrollbarWidth(s.layout);
};

export const getRowHeight = (s: GridViewState): number => {
  return fromLayout.getRowHeight(s.layout);
};

export const getRowExpansionHeight = (s: GridViewState): number => {
  return fromLayout.getRowExpansionHeight(s.layout);
};

export const getScrollContainerHeight = (s: GridViewState): number => {
  return fromLayout.getScrollContainerHeight(s.layout);
};

export const getScrollContainerWidth = (s: GridViewState): number => {
  return fromLayout.getScrollContainerWidth(s.layout);
};

export const getXScrollbarVisible = (s: GridViewState): boolean => {
  return fromSettings.getAllowXScrollbar(s.settings) && fromLayout.getXScrollbarVisible(s.layout);
};

export const getYScrollbarVisible = (s: GridViewState): boolean => {
  return fromSettings.getAllowYScrollbar(s.settings) && fromLayout.getYScrollbarVisible(s.layout);
};

export const getVirtualXScrollIndex = (s: GridViewState): number => {
  return fromLayout.getVirtualXScrollIndex(s.layout);
};

export const getVirtualYScrollIndex = (s: GridViewState): number => {
  return fromLayout.getVirtualYScrollIndex(s.layout);
};

export const getLeftXPlaceholderWidth = (s: GridViewState): number => {
  return fromLayout.getLeftXPlaceholderWidth(s.layout);
};

export const getVirtualColumnDefs = (s: GridViewState): ExtendedColumnDef[] => {
  const virtualColumnDefs = fromLayout.getVirtualColumnDefs(s.layout);
  return virtualColumnDefs.length ? virtualColumnDefs : fromColumns.getScrollableColumnDefs(s.columns);
};

export const getVirtualColumnsWidth = (s: GridViewState): number => {
  return fromLayout.getVirtualColumnsWidth(s.layout);
};

export const getItemsPPPNoScrollbar = (s: GridViewState): number => {
  return fromLayout.getItemsPPPNoScrollbar(s.layout);
};

export const getItemsPPPWScrollbar = (s: GridViewState): number => {
  return fromLayout.getItemsPPPWScrollbar(s.layout);
};

export const getItemsPPP = (s: GridViewState): number => {
  return fromLayout.getItemsPPP(s.layout);
};


export const getVirtualExpandedRows = (s: GridViewState): boolean => {
  return fromLayout.getVirtualExpandedRows(s.layout);
};

export const getVisible = (s: GridViewState): boolean => {
  return fromLayout.getVisible(s.layout);
};


/*
 *    Settings
 */

export const getRenderData = (s: GridViewState): { [id: string]: any } => {
  return fromSettings.getRenderData(s.settings);
};

export const getRowExpansionTemplate = (s: GridViewState): (items: any, columnGroupType: ColumnGroupType) => JSX.Element => {
  return fromSettings.getRowExpansionTemplate(s.settings);
};

export const getAlterContextMenu = (s: GridViewState): (contextMenuInfo: AlterContextMenu) => ContextMenuItem[] => {
  return fromSettings.getAlterContextMenu(s.settings);
};

export const getRowIDKey = (s: GridViewState): (item: any) => any => {
  return fromSettings.getRowIDKey(s.settings);
};

export const getResizeableColumns = (s: GridViewState): boolean => {
  return fromSettings.getResizeableColumns(s.settings);
};

export const getFixedTableWidth = (s: GridViewState): boolean => {
  return fromSettings.getFixedTableWidth(s.settings);
};

export const getReorderableColumns = (s: GridViewState): boolean => {
  return fromSettings.getReorderableColumns(s.settings);
};

export const getAllowXScrollbar = (s: GridViewState): boolean => {
  return fromSettings.getAllowXScrollbar(s.settings);
};

export const getAllowYScrollbar = (s: GridViewState): boolean => {
  return fromSettings.getAllowYScrollbar(s.settings);
};

export const getCalculateItemsPerPage = (s: GridViewState): boolean => {
  return fromSettings.getCalculateItemsPerPage(s.settings);
};

// not needed atm
export const getSelectableRows = (s: GridViewState): boolean => {
  return fromSettings.getSelectableRows(s.settings);
};

export const getAllowExport = (s: GridViewState): boolean => {
  return fromSettings.getAllowExport(s.settings);
};

export const getAllowVirtualYScrolling = (s: GridViewState): boolean => {
  return fromSettings.getAllowVirtualYScrolling(s.settings);
};


/*
 *    Columns
 */

export const getColumnDefs = (s: GridViewState): ExtendedColumnDef[] => {
  return fromColumns.getColumnDefs(s.columns);
};

export const getFrozenColumns = (s: GridViewState): number[] => {
  return fromColumns.getFrozenColumns(s.columns);
};

export const getScrollableColumns = (s: GridViewState): number[] => {
  return fromColumns.getScrollableColumns(s.columns);
};

export const getHiddenColumns = (s: GridViewState): number[] => {
  return fromColumns.getHiddenColumns(s.columns);
};

export const getReorderColumn = (s: GridViewState): number => {
  return fromColumns.getReorderColumn(s.columns);
};

export const getFrozenColumnDefs = (s: GridViewState): ExtendedColumnDef[] => {
  return fromColumns.getFrozenColumnDefs(s.columns);
};

export const getScrollableColumnDefs = (s: GridViewState): ExtendedColumnDef[] => {
  return fromColumns.getScrollableColumnDefs(s.columns);
};

export const getReorderColumnDef = (s: GridViewState): ExtendedColumnDef[] => {
  return fromColumns.getReorderColumnDef(s.columns);
};

/*
 *   CONTEXT MENU
 */

export const getContextMenuVisible = (s: GridViewState): boolean => {
  return fromContextMenu.getContextMenuVisible(s.contextMenu);
};

export const getContextMenuX = (s: GridViewState): number => {
  return fromContextMenu.getContextMenuX(s.contextMenu);
};

export const getContextMenuY = (s: GridViewState): number => {
  return fromContextMenu.getContextMenuY(s.contextMenu);
};

export const getContextMenuColumnIndex = (s: GridViewState): number => {
  return fromContextMenu.getContextMenuColumnIndex(s.contextMenu);
};

export const getContextMenuClickOrigin = (s: GridViewState): string => {
  return fromContextMenu.getContextMenuClickOrigin(s.contextMenu);
};

export const getContextMenuTargetElement = (s: GridViewState): EventTarget => {
  return fromContextMenu.getContextMenuTargetElement(s.contextMenu);
};

export const getContextMenuIsFrozenColumn = (s: GridViewState): boolean => {
  return fromContextMenu.getContextMenuIsFrozenColumn(s.contextMenu);
};

export const getContextMenuRowID = (s: GridViewState): string => {
  return fromContextMenu.getContextMenuRowID(s.contextMenu);
};

export const getContextMenuIsSorted = (s: GridViewState): boolean => {
  return fromContextMenu.getContextMenuIsSorted(s.contextMenu);
};

export const getContextMenuIsFrozenRow = (s: GridViewState): boolean => {
  return fromContextMenu.getContextMenuIsFrozenRow(s.contextMenu);
};


/*
 *  GridClassnames
 */

export const getGridClassnames = (s: any): any => {
  return s.gridClassnames;
};

/*
 *  Measure
 */

export const getNeedScrollContainerDimensions = (s: GridViewState): boolean => {
  return fromMeasure.getNeedScrollContainerDimensions(s.measure);
};

export const getNeedRowExpansionHeight = (s: GridViewState): boolean => {
  return fromMeasure.getNeedRowExpansionHeight(s.measure);
};

/*
 *   Last Action
 */

export const getLastAction = (s: GridViewState): ActionTypes => {
  return s.lastAction;
};

/*
 *  CALCULATED GETTERS
 */

export const getRowsByID = (s: GridViewState, IDs: string[]): any[] => {
  return fromData.getRowsByID(s.data, IDs);
};

export const getStartIndex = (s: GridViewState): number => {
  return getCurrentPage(s) * getItemsPerPage(s);
};

export const getScrollableRowIDs = createSelector(
  [getStartIndex, getOutputIDs, getItemsPerPage],
  (startIndex: number, outputIDs: string[], itemsPerPage: number) => {
    const idsOnCurrentPage: string[] = [];
    for (let index = startIndex;
      (index - startIndex) < itemsPerPage
      && index < outputIDs.length;
      ++index) {
      idsOnCurrentPage.push(outputIDs[index]);
    }
    return idsOnCurrentPage;
  },
);

export const getScrollableRows = createSelector(
  [getScrollableRowIDs, getInput],
  (scrollableRowIDs: string[], input: any) => {
    return scrollableRowIDs.map(ID => input[ID]);
  },
);

export const getFrozenRows = (s: GridViewState): any[] => {
  return fromData.getFrozenRows(s.data);
};

export const getVirtualStartIndex = (s: GridViewState): number => {
  getYScrollPosition(s);
  return 0;
};

export const getGridHeight = createSelector(
  [
    getScrollableRowIDs,
    getRowHeight,
    getExpandedRowIDs,
    getRowExpansionHeight,
    getAllowVirtualYScrolling,
    getVirtualExpandedRows,
  ],
  (scrollableRowIDs, rowHeight, expandedRowIDs, rowExpansionHeight, allowVirtualYScrolling, virtualExpandedRows) => {
    if (allowVirtualYScrolling) {
      return virtualExpandedRows
        ? scrollableRowIDs.length * (rowHeight + rowExpansionHeight)
        : scrollableRowIDs.length * rowHeight;
    }
    const expandedScrollableRowIDs = intersection(scrollableRowIDs, expandedRowIDs);
    return scrollableRowIDs.length * rowHeight + expandedScrollableRowIDs.length * rowExpansionHeight;
  },
);

export const getRightXPlaceholderWidth = createSelector(
  [getScrollableColumns, getColumnStyles, getLeftXPlaceholderWidth, getVirtualColumnsWidth],
  (scrollableColumns, columnStyles, leftXPlaceholderWidth, virtualColumnsWidth) => {
    const result = scrollableColumns.reduce(
      (totalWidth, columnIndex) => totalWidth + (columnStyles[columnIndex].minWidth as number), 0,
    );
    // console.log('totalWidth: ' + result);
    return result - leftXPlaceholderWidth - virtualColumnsWidth;
  },
);

export const getTopPlaceholderHeight = (s: GridViewState): number => {
  // console.log('reducer - topPlaceholderHeight: ' + fromLayout.getTopPlaceholderHeight(s.layout));
  return getAllowVirtualYScrolling ? fromLayout.getTopPlaceholderHeight(s.layout) : 0;
};

export const getGridWidth = createSelector(
  [getScrollableColumns, getColumnStyles],
  (scrollableColumns, columnStyles) => {
    return scrollableColumns.reduce((sum, columnIndex) => {
      return sum + (columnStyles[columnIndex].minWidth as number);
    }, 0);
  },
);

