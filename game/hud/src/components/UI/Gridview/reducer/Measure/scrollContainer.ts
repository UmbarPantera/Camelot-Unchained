/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GridViewState, getFrozenRowIDs } from '../reducer';
import { ActionTypes, ActionTypeKeys } from '../actions';


export const needScrollContainerDimensions = (s: boolean = true, a: ActionTypes, gridViewState: GridViewState): boolean => {
  switch (a.type) {
    case ActionTypeKeys.ON_EXPANDER_CHANGED: {
      return getFrozenRowIDs(gridViewState).indexOf(a.rowID) !== -1
        ? s
          ? s
          : true
        : s;
    }
    case ActionTypeKeys.FREEZE_ROW:
    case ActionTypeKeys.UNFREEZE_ROW:
    case ActionTypeKeys.ON_FROZEN_COLUMN_CHANGED:
    case ActionTypeKeys.SET_SHOW_MULTIFILTERS: {
      return true;
    }
    case ActionTypeKeys.SET_SCROLL_CONTAINER_DIMENSIONS: {
      return s ? false : s;
    }
    case ActionTypeKeys.ON_SCROLL_CONTAINER_CHANGED_DIMENSIONS: {
      return a.scrollContainerChangedDimensions;
    }
    default: return s;
  }
};

export default needScrollContainerDimensions;
