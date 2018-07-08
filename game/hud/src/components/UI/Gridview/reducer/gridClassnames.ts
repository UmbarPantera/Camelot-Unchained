/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { css } from 'react-emotion';
import { defaultGridViewStyle } from '../components/GridViewMain';
import { ActionTypeKeys, ActionTypes }  from './actions';
import { GridViewClassNames } from '../components';

export const initialState = (): GridViewClassNames => {
  return cycleObject(defaultGridViewStyle);
};

export const gridClassnames = (s: GridViewClassNames = initialState(), a: ActionTypes): GridViewClassNames => {
  switch (a.type) {
    case ActionTypeKeys.IMPORT_GRIDVIEW_STYLE: {
      return cycleObject(a.gridViewStyle);
    }
    default: return s;
  }
};

const cycleObject = (objectToCheck: any): any => {
  const result: any = {};
  Object.keys(objectToCheck).forEach((key: any) => {
    const noCSSObject = isCssObject(objectToCheck[key]);
    if (noCSSObject) {
      result[key] = cycleObject(objectToCheck[key]);
    } else {
      result[key] = css(objectToCheck[key]);
      const keepObject = ['button', 'buttonDisabled', 'filterInput', 'filterInputWrapper', 'contextMenuButton'];
      if (keepObject.indexOf(key) !== -1) result[key] = objectToCheck[key];
    }
  });
  return result;
};

const isCssObject = (valueToCheck: any): boolean => {
  const keyArray = Object.keys(valueToCheck);
  return typeof valueToCheck[keyArray[0]] === 'object';
};

export default gridClassnames;
