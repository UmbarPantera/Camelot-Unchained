/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// import { ExtendedColumnDef } from '../components/App';
import { ActionTypeKeys, ActionTypes }  from '../actions';


export const multiFilter = (s: string[], a: ActionTypes): string[] => {
  switch (a.type) {
    case ActionTypeKeys.SET_FILTER: {
      return [
        ...s.slice(0, a.filterIndex),
        a.filterValue,
        ...s.slice(a.filterIndex + 1),
      ];
    }
    case ActionTypeKeys.IMPORT_COLUMN_DEFS: {
      // The multiFilter array must have the same length as columnDefs. When we initialize the store we do not know
      // columnDefs and it length so we have to prepare the filters, if columnDefs are imported
      return s.length !== a.columnDefs.length ? a.columnDefs.map(def => '') : s;
    }
    default: return s;
  }
};

export default multiFilter;
