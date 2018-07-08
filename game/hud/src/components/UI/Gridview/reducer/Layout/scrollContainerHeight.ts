/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes }  from '../actions';


export const scrollContainerHeight = (s: number = 0, a: ActionTypes, rowHeight: number): number => {
  switch (a.type) {
    case ActionTypeKeys.SET_SCROLL_CONTAINER_HEIGHT: {
      return a.scrollContainerHeight;
    }
    case ActionTypeKeys.SET_SCROLL_CONTAINER_DIMENSIONS: {
      return a.scrollContainerHeight;
    }
    case ActionTypeKeys.FREEZE_ROW: {
      return s - rowHeight;
    }
    case ActionTypeKeys.UNFREEZE_ROW: {
      return s + rowHeight;
    }

    default: return s;
  }
};

export default scrollContainerHeight;
