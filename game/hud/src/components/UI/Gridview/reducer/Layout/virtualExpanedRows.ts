/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypes, ActionTypeKeys } from '../actions';
import { GridViewState, getAllowVirtualYScrolling, getFrozenRowIDs } from '../reducer';

export const virtualExpandedRows = (
  s: boolean = false,
  a: ActionTypes,
  gridViewState: GridViewState,
): boolean => {
  switch (a.type) {
    case ActionTypeKeys.ON_EXPANDER_CHANGED: {
      return getAllowVirtualYScrolling(gridViewState) && getFrozenRowIDs(gridViewState).indexOf(a.rowID) === -1
        ? !s
        : s;
    }
    default: return s;
  }
};

export default virtualExpandedRows;
