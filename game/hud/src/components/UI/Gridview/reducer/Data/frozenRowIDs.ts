/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes }  from '../actions';


export const  frozenRowIDs = (s: string[] = [], a: ActionTypes): string[] => {
  switch (a.type) {
    case ActionTypeKeys.FREEZE_ROW: {
      return [...s, a.rowID];
    }
    case ActionTypeKeys.UNFREEZE_ROW: {
      return s.filter(ID => ID !== a.rowID);
    }
    case ActionTypeKeys.SET_FROZEN_ROW_IDS: {
      return a.frozenRowIDs;
    }
    default: return s;
  }
};

export default frozenRowIDs;
