/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { intersection } from 'lodash';
import { ActionTypeKeys, ActionTypes }  from '../actions';
import { GridViewState, getFrozenRowIDs, getAllowVirtualYScrolling } from '../reducer';


export interface ItemsPPPDState {
  itemsPPPNoScrollbar: number;
  itemsPPPWScrollbar: number;
}

export const itemsPPPD = (
  s: ItemsPPPDState = initialState(),
  a: ActionTypes,
  gridViewState: GridViewState,
  nextVirtualExpandedRows: boolean,
  nextScrollContainerHeight: number,
  nextRowHeight: number,
  nextScrollbarWidth: number,
  nextExpandedRowIDs: string[],
  nextRowExpansionHeight: number,
): ItemsPPPDState => {
  switch (a.type) {
    case ActionTypeKeys.ON_EXPANDER_CHANGED:
    case ActionTypeKeys.SET_EXPANDED_ROW_IDS:
    case ActionTypeKeys.SET_CURRENT_PAGE:
    case ActionTypeKeys.SET_SCROLL_CONTAINER_HEIGHT:
    case ActionTypeKeys.SET_SCROLL_CONTAINER_DIMENSIONS:
    case ActionTypeKeys.SET_SHOW_MULTIFILTERS:
    case ActionTypeKeys.SET_ROW_EXPANSION_HEIGHT:
    case ActionTypeKeys.SET_SCROLLBAR_WIDTH:
    case ActionTypeKeys.SET_ROW_HEIGHT: {
      if (getAllowVirtualYScrolling(gridViewState)) {
        const totalHeight = nextVirtualExpandedRows
          ? nextRowHeight + nextRowExpansionHeight
          : nextRowHeight;
        const itemsPPPNoScrollbar = Math.floor(nextScrollContainerHeight / totalHeight) || 1;
        // console.log('itemsPerPagePossible: ' + itemsPerPagePossible);
        const itemsPPPWScrollbar = Math.floor((nextScrollContainerHeight - nextScrollbarWidth) / totalHeight) || 1;
      // console.log('itemsPPPWScrollbar: ' + itemsPPPWScrollbar);
        return {
          itemsPPPNoScrollbar,
          itemsPPPWScrollbar,
        };
      }
      const scrollableExpandedRows = nextExpandedRowIDs.length
        - intersection(getFrozenRowIDs(gridViewState), nextExpandedRowIDs).length;
      const totalExpanderHeight =  scrollableExpandedRows * nextRowExpansionHeight;
      // console.log('totalExpanderHeight: ' + totalExpanderHeight);
      // console.log('expanded Rows: ' + expandedRows);
      const availableHeight = nextScrollContainerHeight - totalExpanderHeight;
      if (availableHeight < nextRowHeight) return s; // bandaid
      // console.log('available: ' + availableHeight);
      // console.log('rowHeight: ' + rowHeight);
      const itemsPPPNoScrollbar = Math.floor(availableHeight / nextRowHeight) || 1;
      // console.log('itemsPerPagePossible: ' + itemsPerPagePossible);
      const itemsPPPWScrollbar = Math.floor((availableHeight - nextScrollbarWidth) / nextRowHeight) || 1;
      // console.log('itemsPPPWScrollbar: ' + itemsPPPWScrollbar);

      return {
        itemsPPPNoScrollbar,
        itemsPPPWScrollbar,
      };
    }
    default: return s;
  }
};

export const initialState = (): ItemsPPPDState => {
  return ({
    itemsPPPNoScrollbar: 0,
    itemsPPPWScrollbar: 0,
  });
};

export const getItemsPPPNoScrollbar = (s: ItemsPPPDState): number => {
  return s.itemsPPPNoScrollbar;
};

export const getItemsPPPWScrollbar = (s: ItemsPPPDState): number => {
  return s.itemsPPPWScrollbar;
};

export default itemsPPPD;
