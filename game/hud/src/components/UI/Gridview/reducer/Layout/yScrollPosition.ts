/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes }  from '../actions';
import { GridViewState, getAllowVirtualYScrolling, getVirtualYScrollIndex } from '../reducer';


export const yScrollPosition = (
  s: number = 0,
  a: ActionTypes,
  gridViewState: GridViewState,
  nextRowHeight: number,
  nextRowExpansionHeight: number,
  nextVirtualExpandedRows: boolean,
): number => {
  switch (a.type) {
    case ActionTypeKeys.SET_Y_SCROLL_POSITION: {
      return a.yScrollPosition;
    }
    case ActionTypeKeys.ON_EXPANDER_CHANGED:
    case ActionTypeKeys.SET_EXPANDED_ROW_IDS:
    case ActionTypeKeys.SET_ROW_EXPANSION_HEIGHT: {
      // adjust the scroll position to the changed dimensions of the grid, so the same rows remain visiblej
      // this is necessary because if virtual y-scrolling is possible all rows have to be expanded at once
      // -> rows off screen get expanded, too -> causes the jumps
      if (getAllowVirtualYScrolling(gridViewState)) {
        // console.log(nextExpandedRowIDs);
        // console.log(nextRowHeight);
        // console.log(nextRowExpansionHeight);
        if (nextVirtualExpandedRows) {
          // const nextYScrollPosition = getVirtualYScrollIndex(gridViewState) * (nextRowHeight + nextRowExpansionHeight);
          // const nextYScrollPosition = Math.floor(s / nextRowHeight * (nextRowHeight + nextRowExpansionHeight));
          // console.log('yscrollpos-nextXScrollPos: ' + nextYScrollPosition);
          return getVirtualYScrollIndex(gridViewState) * (nextRowHeight + nextRowExpansionHeight);
        }
        // const nextYScrollPosition = getVirtualYScrollIndex(gridViewState) * nextRowHeight;
        // const nextYScrollPosition = Math.floor(s / (nextRowHeight + nextRowExpansionHeight) * nextRowHeight);
        // console.log('yscrollpos-nextXScrollPos: ' + nextYScrollPosition);
        return getVirtualYScrollIndex(gridViewState) * nextRowHeight;
      }
      return s;
    }
    case ActionTypeKeys.SET_CURRENT_PAGE: {
      return 0;
    }
    default: return s;
  }
};

export default yScrollPosition;
