/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes }  from '../actions';


export const frozenColumns = (s: number[] = [], a: ActionTypes): number[] => {
  switch (a.type) {
    case ActionTypeKeys.SET_FROZEN_COLUMNS: {
      return a.frozenColumns;
    }
    case ActionTypeKeys.ON_FROZEN_COLUMN_CHANGED: {
      if (s.indexOf(a.columnIndex) === -1) {
        return [...s, a.columnIndex];
      }
      return s.filter(columIndex => columIndex !== a.columnIndex);
    }
    case ActionTypeKeys.SET_HIDDEN_COLUMNS: {
      return s.filter(columnIndex => a.hiddenColumns.indexOf(columnIndex) === -1);
    }
    default: return s;
  }
};

export default frozenColumns;
