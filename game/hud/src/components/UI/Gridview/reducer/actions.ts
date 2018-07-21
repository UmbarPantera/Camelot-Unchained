/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { merge } from 'lodash';
import {
  ColumnDefinition, ExtendedColumnDef, SortInfo, defaultGridViewStyle, GridViewStyle,
} from '../components/GridViewMain';
import { SettingState } from './settings';

export interface OtherAction {
  type: ActionTypeKeys.OTHER_ACTION;
}

export enum ActionTypeKeys {
  IMPORT_DATA = 'IMPORT_DATA',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  IMPORT_COLUMN_DEFS = 'IMPORT_COLUMN_DEFS',
  IMPORT_COLUMN_STYLES = 'IMPORT_COLUMN_STYLES',
  IMPORT_ROW_ID_KEY = 'IMPORT_ROW_ID_KEY',
  IMPORT_GRIDVIEW_STYLE = 'IMPORT_GRIDVIEW_STYLE',
  SET_SHOW_MULTIFILTERS = 'SET_SHOW_MULTIFILTERS',
  SET_FILTER = 'SET_FILTER',
  SET_MULTIFILTER = 'SET_MULTIFILTER',
  SET_FROZEN_ROW_IDS = 'SET_FROZEN_ROW_IDS',
  FREEZE_ROW = 'FREEZE_ROW',
  UNFREEZE_ROW = 'UNFREEZE_ROW',
  SET_GLOBAL_FILTER = 'SET_GLOBAL_FILTER',
  SET_MULTI_SORT = 'SET_MULTI_SORT',
  UNSORT_COLUMN = 'UNSORT_COLUMN',
  SET_ITEMS_PER_PAGE = 'SET_ITEMS_PER_PAGE',
  SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
  SET_X_SCROLL_POSITION = 'SET_X_SCROLL_POSITION',
  SET_Y_SCROLL_POSITION = 'SET_Y_SCROLL_POSITION',
  SET_COLUMN_REORDERING = 'COLUMN_REORDERING',
  SET_SELECTED_ROW_IDS = 'SET_SELECTED_ROW_IDS',
  SET_EXPANDED_ROW_IDS = 'SET_EXPANDED_ROW_IDS',
  SET_FROZEN_COLUMNS = 'SET_FROZEN_COLUMNS',
  SET_SCROLLABLE_COLUMNS = 'SET_SCROLLABLE_COLUMNS',
  SET_HIDDEN_COLUMNS = 'SET_HIDDEN_COLUMNS',
  SET_SCROLLBAR_WIDTH = 'SET_SCROLLBAR_WIDTH',
  SET_ROW_HEIGHT = 'SET_ROW_HEIGHT',
  SET_ROW_EXPANSION_HEIGHT = 'SET_ROW_EXPANSION_HEIGHT',
  SET_SCROLL_CONTAINER_HEIGHT = 'SET_SCROLL_CONTAINER_HEIGHT',
  SET_SCROLL_CONTAINER_WIDTH = 'SET_SCROLL_CONTAINER_WIDTH',
  SET_SCROLL_CONTAINER_DIMENSIONS = 'SET_SCROLL_CONTAINER_DIMENSIONS',
  SET_CONTEXT_MENU_VISIBLE = 'SET_CONTEXT_MENU_VISIBLE',
  SET_REORDER_COLUMN = 'SET_REORDER_COLUMN',
  SET_VIRTUAL_START_INDEX = 'SET_VIRTUAL_START_INDEX',
  SET_VISIBLE = 'SET_VISIBLE',

  ON_ROW_CLICK = 'ON_ROW_CLICK',
  ON_EXPANDER_CHANGED = 'ON_EXPANDER_CHANGED',
  ON_FROZEN_COLUMN_CHANGED = 'ON_FROZEN_COLUMN_CHANGED',
  ON_HEADER_CONTEXT_MENU = 'ON_HEDAER_CONTEXT_MENU',
  ON_GRID_CONTEXT_MENU = 'ON_GRID_CONTEXT_MENU',
  ON_SCROLL_CONTAINER_CHANGED_DIMENSIONS = 'ON_SCROLL_CONTAINER_CHANGED_DIMENSIONS',
  OTHER_ACTION = '__any_other_action_type__',
}

/*
 * ACTION INTERFACE
 */

export interface ImportData {
  type: ActionTypeKeys.IMPORT_DATA;
  data: any[];
  rowIDKey?: (item: any) => any;
}

export interface ImportColumnDefs {
  type: ActionTypeKeys.IMPORT_COLUMN_DEFS;
  columnDefs: ExtendedColumnDef[];
}

export interface ImportSettings {
  type: ActionTypeKeys.IMPORT_SETTINGS;
  settings: SettingState;
}

export interface ImportColumnStyles {
  type: ActionTypeKeys.IMPORT_COLUMN_STYLES;
  columnStyles: React.CSSProperties[];
}

export interface ImportRowIDKey {
  type: ActionTypeKeys.IMPORT_ROW_ID_KEY;
  rowIDKey: (item: any) => any;
}

export interface ImportGridViewStyle {
  type: ActionTypeKeys.IMPORT_GRIDVIEW_STYLE;
  gridViewStyle: GridViewStyle;
}

export interface SetShowMultiFilters {
  type: ActionTypeKeys.SET_SHOW_MULTIFILTERS;
  showMultiFilters: boolean;
}

export interface SetFilter {
  type: ActionTypeKeys.SET_FILTER;
  filterIndex: number;
  filterValue: string;
}

export interface SetMultiFilter {
  type: ActionTypeKeys.SET_MULTIFILTER;
  filterArray: string[];
}

export interface SetFrozenRowIDs {
  type: ActionTypeKeys.SET_FROZEN_ROW_IDS;
  frozenRowIDs: string[];
}

export interface FreezeRow {
  type: ActionTypeKeys.FREEZE_ROW;
  rowID: string;
}

export interface UnfreezeRow {
  type: ActionTypeKeys.UNFREEZE_ROW;
  rowID: string;
}

export interface SetGlobalFilter {
  type: ActionTypeKeys.SET_GLOBAL_FILTER;
  globalFilter: string;
}

export interface SetMultiSort {
  type: ActionTypeKeys.SET_MULTI_SORT;
  sortInfos: SortInfo[];
}

export interface UnsortColumn {
  type: ActionTypeKeys.UNSORT_COLUMN;
  columnIndex: number;
}

export interface SetItemsPerPage {
  type: ActionTypeKeys.SET_ITEMS_PER_PAGE;
  itemsPerPage: number;
}

export interface SetCurrentPage {
  type: ActionTypeKeys.SET_CURRENT_PAGE;
  currentPage: number;
}

export interface SetXScrollPosition {
  type: ActionTypeKeys.SET_X_SCROLL_POSITION;
  xScrollPosition: number;
}

export interface SetYScrollPosition {
  type: ActionTypeKeys.SET_Y_SCROLL_POSITION;
  yScrollPosition: number;
}

export interface ColumnReordering {
  type: ActionTypeKeys.SET_COLUMN_REORDERING;
  columnReordering: boolean;
}

export interface SetSelectedRowIDs {
  type: ActionTypeKeys.SET_SELECTED_ROW_IDS;
  selectedRowIDs: string[];
}

export interface SetExpandedRowIDs {
  type: ActionTypeKeys.SET_EXPANDED_ROW_IDS;
  expandedRowIDs: string[];
}

export interface SetFrozenColumns {
  type: ActionTypeKeys.SET_FROZEN_COLUMNS;
  frozenColumns: number[];
}

export interface SetScrollableColumns {
  type: ActionTypeKeys.SET_SCROLLABLE_COLUMNS;
  scrollableColumns: number[];
}

export interface SetHiddenColumns {
  type: ActionTypeKeys.SET_HIDDEN_COLUMNS;
  hiddenColumns: number[];
}

export interface SetScrollbarWidth {
  type: ActionTypeKeys.SET_SCROLLBAR_WIDTH;
  scrollbarWidth: number;
}

export interface SetRowHeight {
  type: ActionTypeKeys.SET_ROW_HEIGHT;
  rowHeight: number;
}

export interface SetRowExpansionHeight {
  type: ActionTypeKeys.SET_ROW_EXPANSION_HEIGHT;
  rowExpansionHeight: number;
}

export interface SetScrollContainerHeight {
  type: ActionTypeKeys.SET_SCROLL_CONTAINER_HEIGHT;
  scrollContainerHeight: number;
}

export interface SetScrollContainerWidth {
  type: ActionTypeKeys.SET_SCROLL_CONTAINER_WIDTH;
  scrollContainerWidth: number;
}

export interface SetScrollContainerDimensions {
  type: ActionTypeKeys.SET_SCROLL_CONTAINER_DIMENSIONS;
  scrollContainerWidth: number;
  scrollContainerHeight: number;
}

export interface SetContextMenuVisible {
  type: ActionTypeKeys.SET_CONTEXT_MENU_VISIBLE;
  contextMenuVisible: boolean;
}

export interface SetReorderColumn {
  type: ActionTypeKeys.SET_REORDER_COLUMN;
  reorderColumn: number;
}

export interface SetVirtualStartIndex {
  type: ActionTypeKeys.SET_VIRTUAL_START_INDEX;
  virtualStartIndex: number;
}

export interface SetVisible {
  type: ActionTypeKeys.SET_VISIBLE;
  visible: boolean;
}

// ON



export interface OnRowClick {
  type: ActionTypeKeys.ON_ROW_CLICK;
  event: React.MouseEvent<HTMLSpanElement>;
  rowID: string;
}

export interface OnExpanderChanged {
  type: ActionTypeKeys.ON_EXPANDER_CHANGED;
  rowID: string;
}

export interface OnFrozenColumnChanged {
  type: ActionTypeKeys.ON_FROZEN_COLUMN_CHANGED;
  columnIndex: number;
}

export interface OnHeaderContextMenu {
  type: ActionTypeKeys.ON_HEADER_CONTEXT_MENU;
  contextMenuVisible: boolean;
  xPosition: number;
  yPosition: number;
  columnIndex: number;
  clickOrigin: string;
  targetElement: EventTarget;
  isFrozenColumn: boolean;
  isSorted?: boolean;
}

export interface OnGridContextMenu {
  type: ActionTypeKeys.ON_GRID_CONTEXT_MENU;
  contextMenuVisible: boolean;
  xPosition: number;
  yPosition: number;
  columnIndex: number;
  clickOrigin: string;
  targetElement: EventTarget;
  rowID: string;
  isFrozenColumn: boolean;
  isFrozenRow: boolean;
}

export interface OnScrollContainerChangedDimensions {
  type: ActionTypeKeys.ON_SCROLL_CONTAINER_CHANGED_DIMENSIONS;
  scrollContainerChangedDimensions: boolean;
}


export type ActionTypes =
	| ImportData
	| ImportColumnDefs
  | ImportSettings
  | ImportColumnStyles
  | ImportRowIDKey
  | ImportGridViewStyle
  | SetShowMultiFilters
  | SetFilter
  | SetMultiFilter
  | SetFrozenRowIDs
  | FreezeRow
  | UnfreezeRow
  | SetGlobalFilter
  | SetMultiSort
  | UnsortColumn
  | SetItemsPerPage
  | SetCurrentPage
  | SetXScrollPosition
  | SetYScrollPosition
  | ColumnReordering
  | SetSelectedRowIDs
  | SetExpandedRowIDs
  | SetFrozenColumns
  | SetScrollableColumns
  | SetHiddenColumns
  | SetScrollbarWidth
  | SetRowHeight
  | SetRowExpansionHeight
  | SetScrollContainerHeight
  | SetScrollContainerWidth
  | SetScrollContainerDimensions
  | SetContextMenuVisible
  | SetReorderColumn
  | SetVirtualStartIndex
  | SetVisible
  | OnRowClick
  | OnExpanderChanged
  | OnFrozenColumnChanged
  | OnHeaderContextMenu
  | OnGridContextMenu
  | OnScrollContainerChangedDimensions;

/*
 * ACTION CREATORS
 */


export const importColumnDefs = (columnDefs: ColumnDefinition[]): ImportColumnDefs => ({
  type: ActionTypeKeys.IMPORT_COLUMN_DEFS,
  columnDefs: columnDefs.map((def, index) => {
    const extendedDef: ExtendedColumnDef = { ...def, columnIndex: index };
    return extendedDef;
  }),
});

export const importData = (data: any[], rowIDKey?: (item: any) => any): ImportData => ({
  type: ActionTypeKeys.IMPORT_DATA,
  data,
  rowIDKey,
});

export const importSettings = (settings: SettingState): ImportSettings => ({
  type: ActionTypeKeys.IMPORT_SETTINGS,
  settings,
});


export const importColumnStyles = (columnStyles: React.CSSProperties[]): ImportColumnStyles => ({
  type: ActionTypeKeys.IMPORT_COLUMN_STYLES,
  columnStyles,
});

export const importRowIDKey = (rowIDKey: (item: any) => any): ImportRowIDKey => ({
  type: ActionTypeKeys.IMPORT_ROW_ID_KEY,
  rowIDKey,
});

export const importGridViewStyle = (gridViewStyle: Partial<GridViewStyle>): ImportGridViewStyle => ({
  type: ActionTypeKeys.IMPORT_GRIDVIEW_STYLE,
  gridViewStyle: merge({}, defaultGridViewStyle, gridViewStyle),
});

export const setShowMultiFilters = (showMultiFilters: boolean): SetShowMultiFilters => ({
  type: ActionTypeKeys.SET_SHOW_MULTIFILTERS,
  showMultiFilters,
});

export const setFilter = (filterIndex: number, filterValue: string): SetFilter => ({
  type: ActionTypeKeys.SET_FILTER,
  filterIndex,
  filterValue,
});

export const setMultiFilter = (filterArray: string[]): SetMultiFilter => ({
  type: ActionTypeKeys.SET_MULTIFILTER,
  filterArray,
});

export const setFrozenRowIDs = (frozenRowIDs: string[]): SetFrozenRowIDs => ({
  type: ActionTypeKeys.SET_FROZEN_ROW_IDS,
  frozenRowIDs,
});

export const freezeRow = (rowID: string): FreezeRow => ({
  type: ActionTypeKeys.FREEZE_ROW,
  rowID,
});

export const unfreezeRow = (rowID: string): UnfreezeRow => ({
  type: ActionTypeKeys.UNFREEZE_ROW,
  rowID,
});

export const setGlobalFilter = (globalFilter: string): SetGlobalFilter => ({
  type: ActionTypeKeys.SET_GLOBAL_FILTER,
  globalFilter,
});

export const setMultiSort = (sortInfos: SortInfo[]): SetMultiSort => ({
  type: ActionTypeKeys.SET_MULTI_SORT,
  sortInfos,
});

export const unsortColumn = (columnIndex: number): UnsortColumn => ({
  type: ActionTypeKeys.UNSORT_COLUMN,
  columnIndex,
});

export const setItemsPerPage = (itemsPerPage: number): SetItemsPerPage => ({
  type: ActionTypeKeys.SET_ITEMS_PER_PAGE,
  itemsPerPage,
});

export const setCurrentPage = (currentPage: number): SetCurrentPage => ({
  type: ActionTypeKeys.SET_CURRENT_PAGE,
  currentPage,
});

export const setXScrollPosition = (xScrollPosition: number): SetXScrollPosition => ({
  type: ActionTypeKeys.SET_X_SCROLL_POSITION,
  xScrollPosition,
});

export const setYScrollPosition = (yScrollPosition: number): SetYScrollPosition => ({
  type: ActionTypeKeys.SET_Y_SCROLL_POSITION,
  yScrollPosition,
});

export const columnReordering = (columnReordering: boolean): ColumnReordering => ({
  type: ActionTypeKeys.SET_COLUMN_REORDERING,
  columnReordering,
});

export const setSelectedRowIDs = (selectedRowIDs: string[]): SetSelectedRowIDs => ({
  type: ActionTypeKeys.SET_SELECTED_ROW_IDS,
  selectedRowIDs,
});

export const setExpandedRowIDs = (expandedRowIDs: string[]): SetExpandedRowIDs => ({
  type: ActionTypeKeys.SET_EXPANDED_ROW_IDS,
  expandedRowIDs,
});

export const setFrozenColumns = (frozenColumns: number[]): SetFrozenColumns => ({
  type: ActionTypeKeys.SET_FROZEN_COLUMNS,
  frozenColumns,
});

export const setScrollableColumns = (scrollableColumns: number[]): SetScrollableColumns => ({
  type: ActionTypeKeys.SET_SCROLLABLE_COLUMNS,
  scrollableColumns,
});

export const setHiddenColumns = (hiddenColumns: number[]): SetHiddenColumns => ({
  type: ActionTypeKeys.SET_HIDDEN_COLUMNS,
  hiddenColumns,
});

export const setScrollbarWidth = (scrollbarWidth: number): SetScrollbarWidth => ({
  type: ActionTypeKeys.SET_SCROLLBAR_WIDTH,
  scrollbarWidth,
});

export const setRowHeight = (rowHeight: number): SetRowHeight => ({
  type: ActionTypeKeys.SET_ROW_HEIGHT,
  rowHeight,
});

export const setRowExpansionHeight = (rowExpansionHeight: number): SetRowExpansionHeight => ({
  type: ActionTypeKeys.SET_ROW_EXPANSION_HEIGHT,
  rowExpansionHeight,
});

export const setScrollContainerHeight = (scrollContainerHeight: number): SetScrollContainerHeight => ({
  type: ActionTypeKeys.SET_SCROLL_CONTAINER_HEIGHT,
  scrollContainerHeight,
});

export const setScrollContainerWidth = (scrollContainerWidth: number): SetScrollContainerWidth => ({
  type: ActionTypeKeys.SET_SCROLL_CONTAINER_WIDTH,
  scrollContainerWidth,
});

export const setScrollContainerDimensions = (
  scrollContainerWidth: number,
  scrollContainerHeight: number,
): SetScrollContainerDimensions => ({
  type: ActionTypeKeys.SET_SCROLL_CONTAINER_DIMENSIONS,
  scrollContainerWidth,
  scrollContainerHeight,
});

export const setContextMenuVisible = (contextMenuVisible: boolean): SetContextMenuVisible => ({
  type: ActionTypeKeys.SET_CONTEXT_MENU_VISIBLE,
  contextMenuVisible,
});

export const setReorderColumn = (reorderColumn: number): SetReorderColumn => ({
  type: ActionTypeKeys.SET_REORDER_COLUMN,
  reorderColumn,
});

export const setVirtualStartIndex = (virtualStartIndex: number): SetVirtualStartIndex => ({
  type: ActionTypeKeys.SET_VIRTUAL_START_INDEX,
  virtualStartIndex,
});

export const setVisible = (visible: boolean): SetVisible => ({
  type: ActionTypeKeys.SET_VISIBLE,
  visible,
});


/*
 *  EVENTS
 */

export const onRowClick = (event: React.MouseEvent<HTMLSpanElement>, rowID: string): OnRowClick => ({
  type: ActionTypeKeys.ON_ROW_CLICK,
  event,
  rowID,
});

export const onExpanderChanged = (rowID: string): OnExpanderChanged => ({
  type: ActionTypeKeys.ON_EXPANDER_CHANGED,
  rowID,
});

export const onFrozenColumnChanged = (columnIndex: number): OnFrozenColumnChanged => ({
  type: ActionTypeKeys.ON_FROZEN_COLUMN_CHANGED,
  columnIndex,
});

export const onHeaderContextMenu = (
  contextMenuVisible: boolean,
  xPosition: number,
  yPosition: number,
  columnIndex: number,
  clickOrigin: string,
  targetElement: EventTarget,
  isFrozenColumn: boolean,
  isSorted?: boolean,
): OnHeaderContextMenu => ({
  type: ActionTypeKeys.ON_HEADER_CONTEXT_MENU,
  contextMenuVisible,
  xPosition,
  yPosition,
  columnIndex,
  clickOrigin,
  targetElement,
  isFrozenColumn,
  isSorted,
});

export const onGridContextMenu = (
  contextMenuVisible: boolean,
  xPosition: number,
  yPosition: number,
  columnIndex: number,
  clickOrigin: string,
  targetElement: EventTarget,
  rowID: string,
  isFrozenColumn: boolean,
  isFrozenRow: boolean,
): OnGridContextMenu => ({
  type: ActionTypeKeys.ON_GRID_CONTEXT_MENU,
  contextMenuVisible,
  xPosition,
  yPosition,
  columnIndex,
  clickOrigin,
  targetElement,
  rowID,
  isFrozenColumn,
  isFrozenRow,
});

export const onScrollContainerChangedDimensions = (
  scrollContainerChangedDimensions: boolean,
): OnScrollContainerChangedDimensions => ({
  type: ActionTypeKeys.ON_SCROLL_CONTAINER_CHANGED_DIMENSIONS,
  scrollContainerChangedDimensions,
});


export default ActionTypes;
