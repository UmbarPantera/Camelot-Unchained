/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes } from '../actions';
import { GridViewStyle } from '../../components/GridViewMain';


export interface FontSizesState {
  headerFontSize: number;
  gridFontSize: number;
}

export const initialState = (): FontSizesState => {
  return ({
    headerFontSize: 16,
    gridFontSize: 16,
  });
};


export const fontSizes = (s: FontSizesState = initialState(), a: ActionTypes): FontSizesState => {
  switch (a.type) {
    case ActionTypeKeys.IMPORT_GRIDVIEW_STYLE: {
      // const gridViewStyle = merge({}, defaultGridViewStyle, a.gridViewStyle);
      const relevantHeaderValues = ['headerName', 'headerElements', 'headerItem', 'header', 'preGridContainer',
        'headerContainer', 'tableContainer', 'tableWrapper', 'container'];
      const headerFontSize = getFontSize(relevantHeaderValues, a.gridViewStyle);
      const relevantGridValues = [
        'gridItem',
        'row',
        'grid',
        'gridContainer',
        'tableContainer',
        'tableWrapper',
        'container',
      ];
      const gridFontSize = getFontSize(relevantGridValues, a.gridViewStyle);
      return ({
        headerFontSize,
        gridFontSize,
      });
    }
    default: return s;
  }
};

const getFontSize = (relevantValues: string[], styles: GridViewStyle): number => {
  let calculatedFontSize = 16;
  let fontSizeMultiplier = 1;
  for (let i = 0; i < relevantValues.length; i++) {
    const style = styles[relevantValues[i]];
    if (style.hasOwnProperty('fontSize')) {
      const fontSize = style.fontSize;
      // fontSize is of type number it means this number represents a pixel value, so we are done here
      if (typeof (fontSize) === 'number') {
        calculatedFontSize = fontSize;
        break;
      } else {
        const fontSizeValue = parseFloat(fontSize);
        if (fontSize.indexOf('em') !== -1) {
          fontSizeMultiplier *= fontSizeValue;
        } else {
          calculatedFontSize = fontSizeValue;
          break;
        }
      }
    }
  }
  return calculatedFontSize * fontSizeMultiplier;
};

export default fontSizes;
