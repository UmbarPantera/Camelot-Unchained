/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypes }  from '../actions';
import xScrolling, * as fromXScrolling from './VirtualScrolling/xScrolling';
import { yScrolling } from './VirtualScrolling/yScrolling';
import { GridViewState } from '../reducer';
import { ColumnState } from '../columns';
import { ExtendedColumnDef } from '../../components';


export interface VirtualScrollState {
  xScrolling: fromXScrolling.VirtualXScrollState;
  yStartIndex: number;
}

export const initialState = (): VirtualScrollState => {
  return({
    xScrolling: fromXScrolling.initialState(),
    yStartIndex: 0,
  });
};

export const virtualScrolling = (
  s: VirtualScrollState = initialState(),
  a: ActionTypes,
  gridViewState: GridViewState,
  nextXScrollPosition: number,
  nextYScrollPosition: number,
  nextRowHeight: number,
  nextRowExpansionHeight: number,
  nextColumnState: ColumnState,
  nextColumnStyles: React.CSSProperties[],
  nextScrollContainerWidth: number,
  nextVirtualExpandedRows: boolean,
): VirtualScrollState => {
  return ({
    xScrolling: xScrolling(
      s.xScrolling,
      a,
      nextXScrollPosition,
      nextColumnState,
      nextColumnStyles,
      nextScrollContainerWidth,
    ),
    yStartIndex: yScrolling(
      s.yStartIndex,
      a,
      gridViewState,
      nextYScrollPosition,
      nextRowHeight,
      nextRowExpansionHeight,
      nextVirtualExpandedRows,
    ),
  });
};

export const getXStartIndex = (s: VirtualScrollState): number => {
  return s.xScrolling.xStartIndex;
};

export const getLeftXPlaceholderWidth = (s: VirtualScrollState): number => {
  return s.xScrolling.xLeftPlaceholderWidth;
};

export const getVirtualColumnsWidth = (s: VirtualScrollState): number => {
  return s.xScrolling.virtualColumnsWidth;
};

export const getYStartIndex = (s: VirtualScrollState): number => {
  return s.yStartIndex;
};

export const getVirtualColumnDefs = (s: VirtualScrollState): ExtendedColumnDef[] => {
  return s.xScrolling.virtualColumnDefs;
};

export default virtualScrolling;
