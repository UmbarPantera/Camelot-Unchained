/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { intersection } from 'lodash';
import { ActionTypeKeys, ActionTypes } from '../actions';
import { GridViewState, getAllowVirtualYScrolling, getFrozenRowIDs } from '../reducer';


export const  expandedRowIDs = (s: string[] = [], a: ActionTypes, gridViewState: GridViewState): string[] => {
  switch (a.type) {
    case ActionTypeKeys.SET_EXPANDED_ROW_IDS: {
      return a.expandedRowIDs;
    }
    case ActionTypeKeys.ON_EXPANDER_CHANGED: {
      return getAllowVirtualYScrolling(gridViewState) && getFrozenRowIDs(gridViewState).indexOf(a.rowID) === -1
        ? s
        : s.indexOf(a.rowID) === -1
          ? [...s, a.rowID]
          : s.filter(ID => ID !== a.rowID);
    }
    case ActionTypeKeys.SET_CURRENT_PAGE: {
      // close scrolling expanded rows, if you switch to another page; need for correct calculation of itemsPPP
      return s.length > 0
        ? intersection(getFrozenRowIDs(gridViewState), s)
        : s;
    }
    default: return s;
  }
};

export default expandedRowIDs;
