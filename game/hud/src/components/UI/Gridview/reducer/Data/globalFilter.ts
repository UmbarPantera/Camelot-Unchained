/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes } from '../actions';


export const globalFilter = (s: string = '', a: ActionTypes): string => {
  switch (a.type) {
    case ActionTypeKeys.SET_GLOBAL_FILTER: {
      return a.globalFilter;
    }
    default: return s;
  }
};

export default globalFilter;
