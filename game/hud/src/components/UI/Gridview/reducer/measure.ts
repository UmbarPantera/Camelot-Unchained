/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypes } from './actions';
import needScrollContainerDimensions from './Measure/scrollContainer';
import needRowExpansionHeight from './Measure/rowExpansionHeight';
import { GridViewState } from './reducer';


export interface MeasureState {
  scrollContainer: boolean;
  rowExpansionHeight: boolean;
}

export const initialState = (): MeasureState => {
  return {
    scrollContainer: true,
    rowExpansionHeight: false,
  };
};

export const measure = (s: MeasureState = initialState(), a: ActionTypes, gridViewState: GridViewState): MeasureState => {
  return ({
    scrollContainer: needScrollContainerDimensions(s.scrollContainer, a, gridViewState),
    rowExpansionHeight: needRowExpansionHeight(s.rowExpansionHeight, a),
  });
};

export const getNeedScrollContainerDimensions = (s: MeasureState): boolean => {
  return s.scrollContainer;
};

export const getNeedRowExpansionHeight = (s: MeasureState): boolean => {
  return s.rowExpansionHeight;
};

export default measure;
