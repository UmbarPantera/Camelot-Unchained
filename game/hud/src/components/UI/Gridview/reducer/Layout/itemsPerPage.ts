/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes }  from '../actions';


export const itemsPerPage = (s: number = 20, a: ActionTypes): number => {
  switch (a.type) {
    case ActionTypeKeys.FREEZE_ROW: {
      return s - 1;
    }
    case ActionTypeKeys.UNFREEZE_ROW: {
      return s + 1;
    }
    case ActionTypeKeys.SET_SHOW_MULTIFILTERS: {
      return a.showMultiFilters ? s - 1 : s + 1;
    }
    case ActionTypeKeys.SET_ITEMS_PER_PAGE: {
      return a.itemsPerPage;
    }
    default: return s;
  }
};

export default itemsPerPage;
