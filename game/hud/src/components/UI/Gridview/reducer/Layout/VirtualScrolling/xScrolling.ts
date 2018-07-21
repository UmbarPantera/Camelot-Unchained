/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ExtendedColumnDef } from '../../../components/GridViewMain';
import { ActionTypeKeys, ActionTypes }  from '../../actions';
import { ColumnState, getScrollableColumns, getColumnDefs } from '../../columns';

export interface VirtualXScrollState {
  xStartIndex: number;
  xLeftPlaceholderWidth: number;
  virtualColumnsWidth: number;
  virtualColumnDefs: ExtendedColumnDef[];
  estimationDone: boolean;
}

export const initialState = (): VirtualXScrollState => {
  return({
    xStartIndex: 0,
    xLeftPlaceholderWidth: 0,
    virtualColumnsWidth: 0,
    virtualColumnDefs: [],
    estimationDone: false,
  });
};

export const xScrolling = (
  s: VirtualXScrollState = initialState(),
  a: ActionTypes,
  nextXScrollPosition: number,
  nextColumnState: ColumnState,
  nextColumnStyles: React.CSSProperties[],
  scrollContainerWidth: number,
  // currentXScrollPosition: number,
  // nextXScrollPosition: number,
  // scrollContainerWidth: number,
  // scrollableColumnDefs: ExtendedColumnDef[],
  // columnStyles: CSSProperties[],
): VirtualXScrollState => {

  switch (a.type) {
    case ActionTypeKeys.SET_X_SCROLL_POSITION:
    case ActionTypeKeys.IMPORT_COLUMN_STYLES:
    case ActionTypeKeys.IMPORT_COLUMN_DEFS: {
      const nextScrollableColumns = getScrollableColumns(nextColumnState);
      const nextColumnDefs = getColumnDefs(nextColumnState);
      const nextState = calcXScrolling(
        s,
        a,
        nextXScrollPosition,
        nextColumnStyles,
        scrollContainerWidth,
        nextScrollableColumns,
        nextColumnDefs,
      );
      if (s.xStartIndex === nextState.xStartIndex && s.virtualColumnDefs.length === nextState.virtualColumnDefs.length) {
        return s;
      }
      return nextState;
    }
    case ActionTypeKeys.SET_SCROLL_CONTAINER_DIMENSIONS:
    case ActionTypeKeys.SET_SCROLL_CONTAINER_WIDTH: {
      const nextScrollableColumns = getScrollableColumns(nextColumnState);
      const nextColumnDefs = getColumnDefs(nextColumnState);
      return nextScrollableColumns.length > 0 && s.estimationDone
        ? calcXScrolling(
          s,
          a,
          nextXScrollPosition,
          nextColumnStyles,
          a.scrollContainerWidth,
          nextScrollableColumns,
          nextColumnDefs,
        )
        : s;
    }
    case ActionTypeKeys.SET_SCROLLABLE_COLUMNS: {
      const nextScrollableColumns = getScrollableColumns(nextColumnState);
      const nextColumnDefs = getColumnDefs(nextColumnState);
      return nextScrollableColumns.length > 0 && s.estimationDone
        ? calcXScrolling(
          s,
          a,
          nextXScrollPosition,
          nextColumnStyles,
          scrollContainerWidth,
          nextScrollableColumns,
          nextColumnDefs,
        )
        : s;
    }
    case ActionTypeKeys.IMPORT_DATA: {
      // need to change data import to make sure this works. Move estimateColumns into reducer to make sure it is done,
      // if data is imported
      return ({
        ...s,
        estimationDone: true,
      });
    }
    default: return s;
  }
};

const calcXScrolling = (
  s: VirtualXScrollState = initialState(),
  a: ActionTypes,
  nextXScrollPosition: number,
  nextColumnStyles: React.CSSProperties[],
  scrollContainerWidth: number,
  nextScrollableColumns: number[],
  nextColumnDefs: ExtendedColumnDef[],
): VirtualXScrollState => {
  // const { startIndex, placeholderHeight } = s;
  // console.log(nextScrollableColumns);
  const scrollDifference = nextXScrollPosition - s.xLeftPlaceholderWidth;
  // console.log('startIndex: ' + s.xStartIndex);
  // console.log('nextY: ' + nextYScrollPosition);
  // console.log('PlaceHolderHeight: ' + placeholderHeight);
  // console.log('scrollDif: ' + scrollDifference);
  // console.log(s);
  let xStartIndex: number;
  let additionalWidth = 0;
  // const rightBorder = nextXScrollPosition + scrollContainerWidth;
  if (scrollDifference >= 0) {
    for (xStartIndex = s.xStartIndex; xStartIndex < nextScrollableColumns.length; xStartIndex++) {
      // console.log(xStartIndex);
      const columnWidth: number = nextColumnStyles[nextScrollableColumns[xStartIndex]].minWidth as number;
      // console.log('columnWidth: ' + columnWidth);
      if (columnWidth + additionalWidth > scrollDifference) {
        break;
      }
      additionalWidth += columnWidth;
    }
  } else {
    if (s.xStartIndex > 0) {
      // console.log('startIndex: ' + s.xStartIndex);
      xStartIndex = s.xStartIndex - 1;
      additionalWidth = -(nextColumnStyles[nextScrollableColumns[xStartIndex]].minWidth as number);
      for (xStartIndex; xStartIndex > 0; xStartIndex--) {
        // console.log(i);
        if (additionalWidth < scrollDifference || xStartIndex === 0) {
          break;
        }
        const columnWidth: number = nextColumnStyles[nextScrollableColumns[xStartIndex - 1]].minWidth as number;
        additionalWidth -= columnWidth;
      }
    } else {
      xStartIndex = s.xStartIndex;
    }
  }

  const xPlaceholderWidth = s.xLeftPlaceholderWidth + additionalWidth;
  // Calculate virtualColumnDefs

  let i: number;
  let virtualColumnsWidth = 0;
  const virtualColumnDefs: ExtendedColumnDef[] = [];
  // console.log('start: ' + xStartIndex);
  // console.log(`border: ${nextXScrollPosition + scrollContainerWidth}`);
  // console.log(nextXScrollPosition);
  // console.log(scrollContainerWidth);
  // console.log('xPlaceholderWidth: ' + xPlaceholderWidth);
  for (i = xStartIndex; i < nextScrollableColumns.length; i++) {
    // console.log(i);
    virtualColumnDefs.push(nextColumnDefs[nextScrollableColumns[i]]);
    const columnWidth: number = nextColumnStyles[nextScrollableColumns[i]].minWidth as number;
    virtualColumnsWidth += columnWidth;
    // console.log('columnWidth: ' + columnWidth);
    // console.log('virtualColumnsWidth: ' + virtualColumnsWidth);
    // console.log(virtualColumnsWidth + xPlaceholderWidth);
    if (xPlaceholderWidth + virtualColumnsWidth > nextXScrollPosition + scrollContainerWidth) {
      break;
    }

  }
  // console.log(xStartIndex);

  //
  // console.log('virtualStartIndex: ' + i);
  // console.log('addHeight: ' + additionalHeight);
  // const i = Math.floor(nextYScrollPosition / rowHeight);
  return ({
    xStartIndex,
    xLeftPlaceholderWidth: xPlaceholderWidth,
    virtualColumnsWidth,
    virtualColumnDefs,
    estimationDone: s.estimationDone,
  });
};

export default xScrolling;
