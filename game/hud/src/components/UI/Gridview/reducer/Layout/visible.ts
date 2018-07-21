/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypes, ActionTypeKeys } from '../actions';


export const visible = (s: boolean = false, a: ActionTypes): boolean => {
  switch (a.type) {
    case ActionTypeKeys.SET_VISIBLE: {
      return s === a.visible ? s : a.visible;
    }
    default: return s;
  }
};

export default visible;
