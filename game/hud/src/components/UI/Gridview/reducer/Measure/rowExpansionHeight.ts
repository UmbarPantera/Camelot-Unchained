/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypes, ActionTypeKeys }  from '../actions';


export const needRowExpansionHeight = (s: boolean = true, a: ActionTypes): boolean => {
  switch (a.type) {
    case ActionTypeKeys.SET_ROW_EXPANSION_HEIGHT: {
      return s ? false : s;
    }
    default: return s;
  }
};

export default needRowExpansionHeight;
