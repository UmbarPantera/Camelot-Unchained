/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes }  from '../actions';

export const scrollableColumns = (s: number[] = [], a: ActionTypes): number[] => {
  switch (a.type) {
    case ActionTypeKeys.ON_FROZEN_COLUMN_CHANGED: {
      // remove the column from scrollable columns, if it is scrollable atm
      if (s.indexOf(a.columnIndex) !== -1) {
        return s.filter(columnIndex => columnIndex !== a.columnIndex);
      }
      // trying to find to original position of the column to add it to scrollable columns
      const nextScrollableColumns = s.reduce((nextScrollableColumns, columnIndex, index, currentScrollableColumns) => {
        if (
          currentScrollableColumns[index] < a.columnIndex
          && currentScrollableColumns[index + 1] > a.columnIndex
        ) return [...nextScrollableColumns, columnIndex, a.columnIndex];
        return [...nextScrollableColumns, columnIndex];
      }, []);
      if (nextScrollableColumns.length > s.length) return nextScrollableColumns;
      // if it didn't work out because of reordering, we add it at the end
      return [...s, a.columnIndex];
    }
    case ActionTypeKeys.SET_SCROLLABLE_COLUMNS: {
      return a.scrollableColumns;
    }
    case ActionTypeKeys.IMPORT_COLUMN_DEFS: {
      return a.columnDefs.map(def => def.columnIndex);
    }
    case ActionTypeKeys.SET_FROZEN_COLUMNS: {
      return s.filter(columnIndex => a.frozenColumns.indexOf(columnIndex) === -1);
    }
    case ActionTypeKeys.SET_HIDDEN_COLUMNS: {
      return s.filter(columnIndex => a.hiddenColumns.indexOf(columnIndex) === -1);
    }
    default: return s;
  }
};

export default scrollableColumns;
