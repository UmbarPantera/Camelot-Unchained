/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes }  from '../../actions';
import { GridViewState, getAllowVirtualYScrolling } from '../../reducer';

export const yScrolling = (
  s: number = 0,
  a: ActionTypes,
  gridViewState: GridViewState,
  nextYScrollPosition: number,
  nextRowHeight: number,
  nextRowExpansionHeight: number,
  // currentYScrollPosition: number,
  // nextYScrollPosition: number,
  // scrollableRowIDs: string[],
  nextVirtulExpandedRows: boolean,
  // rowHeight: number,
  // rowExpanderHeight: number,
): number => {
  switch (a.type) {
    case ActionTypeKeys.SET_CURRENT_PAGE:
    case ActionTypeKeys.SET_FILTER:
    case ActionTypeKeys.SET_MULTIFILTER:
    case ActionTypeKeys.SET_GLOBAL_FILTER: {
      return 0;
    }

    case ActionTypeKeys.SET_VIRTUAL_START_INDEX: {
      return a.virtualStartIndex;
    }
    case ActionTypeKeys.SET_Y_SCROLL_POSITION:
    case ActionTypeKeys.ON_EXPANDER_CHANGED:
    case ActionTypeKeys.SET_EXPANDED_ROW_IDS:
    case ActionTypeKeys.SET_ROW_HEIGHT:
    case ActionTypeKeys.SET_ROW_EXPANSION_HEIGHT: {
      // // console.log(scrollableRowIDs);
      // const { startIndex, placeholderHeight } = s;
      // const scrollDifference = nextYScrollPosition - placeholderHeight;
      // console.log('startIndex: ' + startIndex);
      // console.log('nextY: ' + nextYScrollPosition);
      // console.log('PlaceHolderHeight: ' + placeholderHeight);
      // console.log('scrollDif: ' + scrollDifference);
      // let i;
      // let additionalHeight = 0;
      // if (scrollDifference >= 0) {
      //   let rows = 0;
      //   let expandedRows = 0;
      //   for (i = startIndex; i < scrollableRowIDs.length; i++) {
      //     console.log(i);
      //
      //     if (rows * rowHeight + expandedRows * rowExpanderHeight > scrollDifference) {
      //       i--;
      //       break;
      //     }
      //     additionalHeight = rows * rowHeight + expandedRows * rowExpanderHeight;
      //     rows++;
      //     if (expandedRowIDs.indexOf(scrollableRowIDs[i]) !== -1) expandedRows++;
      //   }
      // } else {
      //   let rows = 0;
      //   let expandedRows = 0;
      //   console.log('changedHeight: ' + changedHeight);
      //   if (startIndex > 0) {
      //     console.log('startIndex: ' + startIndex);
      //     for (i = startIndex - 1; i >= 0; i--) {
      //       rows++;
      //       if (expandedRowIDs.indexOf(scrollableRowIDs[i]) !== -1) expandedRows++;
      //       additionalHeight = (rows * rowHeight + expandedRows * rowExpanderHeight) * -1;
      //       console.log(i);
      //       if (additionalHeight < scrollDifference || i === 0) {
      //         break;
      //       }
      //     }
      //   } else {
      //     i = startIndex;
      //   }
      // }
      //
      // console.log('virtualStartIndex: ' + i);
      // console.log('addHeight: ' + additionalHeight);
      if (getAllowVirtualYScrolling(gridViewState)) {
        const nextTotalHeight = nextVirtulExpandedRows ? nextRowHeight + nextRowExpansionHeight : nextRowHeight;
        const i = Math.floor(nextYScrollPosition / nextTotalHeight) || 0;
        // console.log('yscrolling-nextYScrollPosition: ' + nextYScrollPosition);
        // console.log('yscrolling-nextTotalHeight: ' + nextTotalHeight);
        // console.log(i);
        if (s === i) return s;
        return i;
      }
      return s;
    }
    default: return s;
  }
};

export default yScrolling;
