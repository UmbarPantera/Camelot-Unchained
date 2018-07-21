/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CSSProperties } from 'react';
import { ExtendedColumnDef } from '../../components/GridViewMain';
import { ActionTypeKeys, ActionTypes }  from '../actions';
import { FontSizesState } from './fontSizes';


export const columnStyles = (
  s: CSSProperties[] = [],
  a: ActionTypes,
  allRowIDs: string[],
  inputData: any,
  columnDefs: ExtendedColumnDef[],
  fontSizes: FontSizesState,
): CSSProperties[] => {
  switch (a.type) {
    case ActionTypeKeys.IMPORT_COLUMN_STYLES: {
      return a.columnStyles;
    }
    case ActionTypeKeys.IMPORT_DATA: {
      return createColumnStyles(a.data, columnDefs, fontSizes);
    }
    case ActionTypeKeys.IMPORT_COLUMN_DEFS: {
      const dataArray = allRowIDs.map(rowID => inputData[rowID]);
      return createColumnStyles(dataArray, a.columnDefs, fontSizes);
    }
    case ActionTypeKeys.IMPORT_GRIDVIEW_STYLE: {
      return createColumnStyles(inputData, columnDefs, fontSizes);
    }
    default: return s;
  }
};

const createColumnStyles = (
  items: any[],
  columnDefs: ExtendedColumnDef[],
  fontSizes: FontSizesState,
): React.CSSProperties[] => {
  const nextColumnDefs = columnDefs.map((columnDef) => {
    if (columnDef.style && columnDef.style.minWidth) {
      return typeof columnDef.style.minWidth === 'string' && columnDef.style.minWidth.indexOf('px') !== -1
        ? {
          ...columnDef.style,
          minWidth: parseFloat(columnDef.style.minWidth),
        }
        : columnDef.style;
    }
    let max = 0;
    if (items && items.length) {
      items.forEach((item) => {
        const objType = typeof (columnDef.key(item));
        const obj: string = objType === 'number'
          ? columnDef.key(item).toString()
          : objType === 'string'
            ? columnDef.key(item)
            : '';
        if (obj.length && obj.length > max) max = obj.length;
      });
    }
    const headerMinWidth = (columnDef.title.length + 2) * fontSizes.headerFontSize;
    const gridMinWidth = max * fontSizes.gridFontSize;
    const overallMinWidth = gridMinWidth > headerMinWidth ? gridMinWidth : headerMinWidth;
    return ({
      ...columnDef.style,
      minWidth: overallMinWidth,
      width: overallMinWidth,
    });
  });
  // console.log(nextColumnDefs);
  return nextColumnDefs;
};

export default columnStyles;
