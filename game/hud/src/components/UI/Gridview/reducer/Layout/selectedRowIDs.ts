/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes }  from '../actions';


export const selectedRows = (
  s: string[] = [],
  a: ActionTypes,
  frozenRowIDs: string[],
  scrollableRowIDs: string[],
): string[] => {
  switch (a.type) {
    case ActionTypeKeys.SET_SELECTED_ROW_IDS: {
      return a.selectedRowIDs;
    }
    case ActionTypeKeys.ON_ROW_CLICK: {
      // if the crtl key is pressed the row gets selected/unselected
      if (a.event.ctrlKey) {
        if (s.indexOf(a.rowID) === -1) {
          return [...s, a.rowID];
        }
        return s.filter(ID => ID !== a.rowID);
      }

      // if the shift key is pressed we select all rows from the row we clicked to the last row in the selection
      // other rows get unselected
      if (a.event.shiftKey) {
        if (s.length) {
          const startID = s[s.length - 1];
          const allIDsOnPage = [...frozenRowIDs, ...scrollableRowIDs];
          const startIndex = allIDsOnPage.indexOf(startID);
          const endIndex = allIDsOnPage.indexOf(a.rowID);
          const nextSelectedRowIDs: string[] = [];
          if (startIndex < endIndex) {
            for (let i = startIndex; i <= endIndex; i++) {
              nextSelectedRowIDs.push(allIDsOnPage[i]);
            }
          } else {
            for (let i = endIndex; i <= startIndex; i++) {
              nextSelectedRowIDs.push(allIDsOnPage[i]);
            }
          }
          return nextSelectedRowIDs;
        }
      }

      // if neither shift nor crtl key have been pressed: select the row you clicked on, if it isn't the
      // only selected row, deselect any other
      if (s.length !== 1 || s.indexOf(a.rowID) === -1) {
        return [a.rowID];
      }
      return [];
    }
    default: return s;
  }
};

export default selectedRows;
