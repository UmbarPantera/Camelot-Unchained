/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CSSProperties } from 'react';
// import { createSelector } from 'reselect';
import { ActionTypes, ActionTypeKeys } from './actions';
import columnStyles from './Layout/columnStyles';
import xScrollPosition from './Layout/xScrollPosition';
import xScrollbarVisible from './Layout/xScrollbarVisible';
import yScrollPosition from './Layout/yScrollPosition';
import columnReordering from './Layout/columnReordering';
import selectedRowIDs from './Layout/selectedRowIDs';
import expandedRowIDs from './Layout/expandedRowIDs';
import itemsPerPage from './Layout/itemsPerPage';
import showMultiFilters from './Layout/showMultiFilters';
import scrollbarWidth from './Layout/scrollbarWidth';
import rowHeight from './Layout/rowHeight';
import rowExpansionHeight from './Layout/rowExpansionHeight';
import scrollContainerHeight from './Layout/scrollContainerHeight';
import scrollContainerWidth from './Layout/scrollContainerWidth';
import itemsPPPD, * as fromItemsPPPD from './Layout/itemsPPPD';
import fontSizes, * as fromFontSizes from './Layout/fontSizes';
import visible from './Layout/visible';
import virtualExpandedRows from './Layout/virtualExpanedRows';
import { ExtendedColumnDef } from '../components/GridViewMain';
import { GridViewState, getScrollableColumnDefs, getScrollableRowIDs, getFrozenRowIDs, getCurrentPage,
  getCalculateItemsPerPage, getInput, getColumnDefs, getAllRowIDs } from './reducer';
import virtualScrolling, * as fromVirtualScrolling from './Layout/virtualScrolling';
import { ColumnState } from './columns';
import { createSelector } from 'reselect';


export interface LayoutState {
  columnStyles: CSSProperties[];
  xScrollPosition: number;
  yScrollPosition: number;
  columnReordering: boolean;
  selectedRowIDs: string[];
  expandedRowIDs: string[];
  itemsPerPage: number;
  showMultiFilters: boolean;
  scrollbarWidth: number;
  rowHeight: number;
  rowExpansionHeight: number;
  scrollContainerHeight: number;
  scrollContainerWidth: number;
  xScrollbarVisible: boolean;
  yScrollbarVisible: boolean;
  virtualScrolling: fromVirtualScrolling.VirtualScrollState;
  itemsPPPD: fromItemsPPPD.ItemsPPPDState;
  fontSizes: fromFontSizes.FontSizesState;
  virualExpandedRows: boolean;
  visible: boolean;
}

export const layout = (
  s: LayoutState = initialState(),
  a: ActionTypes,
  gridViewState: GridViewState,
  outputIDs: string[],
  nextColumnState: ColumnState,
): LayoutState => {
  // variables and calculation for x-scrollbar
  const nextScrollContainerWidth = scrollContainerWidth(s.scrollContainerWidth, a);
  const nextFontSizes = fontSizes(s.fontSizes, a);
  const nextColumnStyles = columnStyles(
    s.columnStyles,
    a,
    getAllRowIDs(gridViewState),
    getInput(gridViewState),
    getColumnDefs(gridViewState),
    nextFontSizes,
  );
  const nextScrollbarWidth = scrollbarWidth(s.scrollbarWidth, a);
  const scrollableColumnDefs = getScrollableColumnDefs(gridViewState);
  let nextXScrollbarVisible = xScrollbarVisible(
    s.xScrollbarVisible,
    a,
    nextScrollContainerWidth,
    nextColumnStyles,
    scrollableColumnDefs,
    s.yScrollbarVisible, // need the old state here
    nextScrollbarWidth,
  );
  // variables and calculation for y-scrollbar
  const nextExpandedRowIDs = expandedRowIDs(s.expandedRowIDs, a, gridViewState);
  // console.log('nextExpandedRowIDs: ' + nextExpandedRowIDs);
  const nextRowExpansionHeight = rowExpansionHeight(s.rowExpansionHeight, a);
  const nextRowHeight = rowHeight(s.rowHeight, a);
  const nextScrollContainerHeight = scrollContainerHeight(s.scrollContainerHeight, a, nextRowHeight);
  const nextVirtualExpandedRows = virtualExpandedRows(s.virualExpandedRows, a, gridViewState);
  const nextItemsPPPD = itemsPPPD(
    s.itemsPPPD,
    a,
    gridViewState,
    nextVirtualExpandedRows,
    nextScrollContainerHeight,
    nextRowHeight,
    nextScrollbarWidth,
    nextExpandedRowIDs,
    nextRowExpansionHeight,
  );
  // console.log(nextItemsPPPD);

  // if we calculate how many itemsPerPage can be shown without triggering a scrollbar
  // we need to use the itemsPPPData for itemsPerPage
  // if itemsPerPagePossible can't be calculated because of missing measurements we need to show
  // some items to do those measurements
  const nextItemsPerPage = getCalculateItemsPerPage(gridViewState)
    ? nextXScrollbarVisible
      ? nextItemsPPPD.itemsPPPWScrollbar
      : nextItemsPPPD.itemsPPPNoScrollbar
    : itemsPerPage(s.itemsPerPage, a)
    || 20;
  const nextCurrentPage = a.type === ActionTypeKeys.SET_CURRENT_PAGE ? a.currentPage : getCurrentPage(gridViewState);
  const yScrollbarVisible = nextScrollContainerHeight && nextRowHeight && nextScrollbarWidth
    ? calculateYScrollbarVisible(
      nextItemsPerPage,
      nextItemsPPPD,
      nextXScrollbarVisible,
      outputIDs,
      nextCurrentPage,
    )
    : s.yScrollbarVisible;
  // if the y-scrollbar changed we need to check, if it effects the x-scrollbar
  if (yScrollbarVisible !== s.yScrollbarVisible) {
    nextXScrollbarVisible = calculateXScrollbarVisible(
      nextScrollContainerWidth,
      nextColumnStyles,
      scrollableColumnDefs,
      yScrollbarVisible,
      nextScrollbarWidth,
    );
  }

  const scrollableRowIDs = getScrollableRowIDs(gridViewState);
  const frozenRowIDs = getFrozenRowIDs(gridViewState);
  const nextXScrollPosition = xScrollPosition(s.xScrollPosition, a);
  const nextYScrollPosition = yScrollPosition(
    s.yScrollPosition,
    a,
    gridViewState,
    nextRowHeight,
    nextRowExpansionHeight,
    nextVirtualExpandedRows,
  );


  return {
    columnStyles: nextColumnStyles,
    xScrollPosition: nextXScrollPosition,
    yScrollPosition: nextYScrollPosition,
    columnReordering: columnReordering(s.columnReordering, a),
    selectedRowIDs: selectedRowIDs(s.selectedRowIDs, a, frozenRowIDs, scrollableRowIDs),
    expandedRowIDs: nextExpandedRowIDs,
    itemsPerPage: nextItemsPerPage,
    showMultiFilters: showMultiFilters(s.showMultiFilters, a),
    scrollbarWidth: nextScrollbarWidth,
    rowHeight: nextRowHeight,
    rowExpansionHeight: nextRowExpansionHeight,
    scrollContainerHeight: nextScrollContainerHeight,
    scrollContainerWidth: nextScrollContainerWidth,
    xScrollbarVisible: nextXScrollbarVisible,
    yScrollbarVisible,
    virtualScrolling: virtualScrolling(
      s.virtualScrolling,
      a,
      gridViewState,
      nextXScrollPosition,
      nextYScrollPosition,
      nextRowHeight,
      nextRowExpansionHeight,
      nextColumnState,
      nextColumnStyles,
      nextScrollContainerWidth,
      nextVirtualExpandedRows,
    ),
    itemsPPPD: nextItemsPPPD,
    fontSizes: nextFontSizes,
    virualExpandedRows: nextVirtualExpandedRows,
    visible: visible(s.visible, a),
  };
};

export default layout;

export const initialState = (): LayoutState => {
  return {
    columnStyles: [],
    xScrollPosition: 0,
    yScrollPosition: 0,
    columnReordering: false,
    selectedRowIDs: [],
    expandedRowIDs: [],
    itemsPerPage: 20,
    showMultiFilters: true,
    scrollbarWidth: 0,
    rowHeight: 0,
    rowExpansionHeight: 27,
    scrollContainerHeight: 0,
    scrollContainerWidth: 0,
    xScrollbarVisible: false,
    yScrollbarVisible: false,
    virtualScrolling: fromVirtualScrolling.initialState(),
    itemsPPPD: fromItemsPPPD.initialState(),
    fontSizes: fromFontSizes.initialState(),
    virualExpandedRows: false,
    visible: false,
  };
};

export const calculateXScrollbarVisible = (
  scrollContainerWidth: number,
  columnStyles: CSSProperties[],
  scrollableColumnDefs: ExtendedColumnDef[],
  yScrollbarIsVisible: boolean,
  scrollbarWidth: number,
): boolean => {
  const triggerWidth: number = scrollableColumnDefs
    .map(columnDef => (columnStyles[columnDef.columnIndex].minWidth as number))
    .reduce((totalWidth, columnWidth) => {
      return totalWidth + columnWidth;
    });
  // if there is a y-scrollbar, the x-scrollbar is not triggered correctly. The next line fixes this problem
  const scrollbarFix = yScrollbarIsVisible ? scrollbarWidth : 0;
  return triggerWidth + scrollbarFix > scrollContainerWidth;
};

export const calculateYScrollbarVisible = (
  itemsPerPage: number,
  itemsPerPageData: { itemsPPPNoScrollbar: number, itemsPPPWScrollbar: number },
  xScrollbarIsVisible: boolean,
  outputIDs: string[],
  currentPage: number,
): boolean => {
  const { itemsPPPNoScrollbar, itemsPPPWScrollbar } = itemsPerPageData;
  const itemsPPP = xScrollbarIsVisible
    ? itemsPPPWScrollbar
    : itemsPPPNoScrollbar;
  const startIndex = currentPage * itemsPerPage;
  const remainingItems = outputIDs.length - startIndex;
  const result = itemsPPP < itemsPerPage
    ? itemsPPP < remainingItems
      ? true
      : false
    : false;
  return result;
};


/*
 * Getters
 */

export const getColumnStyles = (s: LayoutState): CSSProperties[] => {
  return s.columnStyles;
};

export const getXScrollPosition = (s: LayoutState): number => {
  return s.xScrollPosition;
};

export const getYScrollPosition = (s: LayoutState): number => {
  return s.yScrollPosition;
};

export const getColumnReordering = (s: LayoutState): boolean => {
  return s.columnReordering;
};

export const getSelectedRowIDs = (s: LayoutState): string[] => {
  return s.selectedRowIDs;
};

export const getExpandedRowIDs = (s: LayoutState): string[] => {
  return s.expandedRowIDs;
};

export const getItemsPerPage = (s: LayoutState): number => {
  return s.itemsPerPage;
};

export const getShowMultiFilters = (s: LayoutState): boolean => {
  return s.showMultiFilters;
};

export const getScrollbarWidth = (s: LayoutState): number => {
  return s.scrollbarWidth;
};

export const getRowHeight = (s: LayoutState): number => {
  return s.rowHeight;
};

export const getRowExpansionHeight = (s: LayoutState): number => {
  return s.rowExpansionHeight;
};

export const getScrollContainerHeight = (s: LayoutState): number => {
  return s.scrollContainerHeight;
};

export const getScrollContainerWidth = (s: LayoutState): number => {
  return s.scrollContainerWidth;
};

export const getXScrollbarVisible = (s: LayoutState): boolean => {
  return s.xScrollbarVisible;
};

export const getYScrollbarVisible = (s: LayoutState): boolean => {
  return s.yScrollbarVisible;
};

export const getVirtualXScrollIndex = (s: LayoutState): number => {
  return fromVirtualScrolling.getXStartIndex(s.virtualScrolling);
};

export const getVirtualYScrollIndex = (s: LayoutState): number => {
  return fromVirtualScrolling.getYStartIndex(s.virtualScrolling);
};

export const getLeftXPlaceholderWidth = (s: LayoutState): number => {
  return fromVirtualScrolling.getLeftXPlaceholderWidth(s.virtualScrolling);
};

export const getVirtualColumnsWidth = (s: LayoutState): number => {
  return fromVirtualScrolling.getVirtualColumnsWidth(s.virtualScrolling);
};
export const getVirtualColumnDefs = (s: LayoutState): ExtendedColumnDef[] => {
  return fromVirtualScrolling.getVirtualColumnDefs(s.virtualScrolling);
};

export const getItemsPPPNoScrollbar = (s: LayoutState): number => {
  return fromItemsPPPD.getItemsPPPNoScrollbar(s.itemsPPPD);
};

export const getItemsPPPWScrollbar = (s: LayoutState): number => {
  return fromItemsPPPD.getItemsPPPWScrollbar(s.itemsPPPD);
};

export const getVirtualExpandedRows = (s: LayoutState): boolean => {
  return s.virualExpandedRows;
};

export const getVisible = (s: LayoutState): boolean => {
  return s.visible;
};


// Calculated

export const getTopPlaceholderHeight = createSelector(
  [getRowHeight, getRowExpansionHeight, getVirtualYScrollIndex, getVirtualExpandedRows],
  (rowHeight, rowExpansionHeight, virtualYScrollIndex, virtualExpandedRows) => {
    return virtualExpandedRows
      ? virtualYScrollIndex * (rowHeight + rowExpansionHeight)
      : virtualYScrollIndex * rowHeight;
  },
);

export const getItemsPPP = (s: LayoutState) => {
  return getXScrollbarVisible(s) ? getItemsPPPWScrollbar(s) : getItemsPPPNoScrollbar(s);
};
