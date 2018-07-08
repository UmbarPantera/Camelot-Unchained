/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes }  from '../actions';


export const hiddenColumns  = (s: number[] = [], a: ActionTypes): number[] => {
  switch (a.type) {
    case ActionTypeKeys.SET_HIDDEN_COLUMNS: {
      return a.hiddenColumns;
    }
    default: return s;
  }
};

export default hiddenColumns ;
