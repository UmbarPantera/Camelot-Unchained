/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypes, ActionTypeKeys } from '../actions';
import { CSSProperties } from 'react';
import { ExtendedColumnDef } from '../../components/GridViewMain';


export const xScrollbarVisible = (
  s: boolean = false,
  a: ActionTypes,
  scrollContainerWidth: number,
  columnStyles: CSSProperties[],
  scrollableColumnDefs: ExtendedColumnDef[],
  yScrollbarIsVisible: boolean,
  scrollbarWidth: number,
): boolean => {
  switch (a.type) {
    case ActionTypeKeys.IMPORT_COLUMN_STYLES:
    case ActionTypeKeys.SET_SCROLL_CONTAINER_WIDTH:
    case ActionTypeKeys.SET_SCROLL_CONTAINER_DIMENSIONS:
    case ActionTypeKeys.SET_SCROLLBAR_WIDTH: {
      const triggerWidth: number = scrollableColumnDefs
        .map(columnDef => columnStyles[columnDef.columnIndex].minWidth as number)
        .reduce((totalWidth, columnWidth) => {
          return totalWidth + columnWidth;
        });
      // if there is a y-scrollbar, the x-scrollbar is not triggered correctly. The next line fixes this problem
      const scrollbarFix = yScrollbarIsVisible ? scrollbarWidth : 0;
      return triggerWidth + scrollbarFix > scrollContainerWidth;
    }
    default: return s;
  }
};

export default xScrollbarVisible;
