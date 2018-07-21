/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSelector } from 'reselect';
import changeData from './Data/changeData';
import { SortInfo }  from '../components/GridViewMain';
import { ActionTypeKeys, ActionTypes } from './actions';
import { GridViewState } from '../reducer/reducer';
import multiFilter from './Data/multiFilter';


export interface DataState {
  input: any;
  outputIDs: string[];
  frozenRowIDs: string[];
  multiSort: SortInfo[];
  multiFilter: string[];
  globalFilter: string;
  allRowIDs: string[];
  rowIDKey: (item: any) => any;
  currentPage: number;
}

export const data = (s: DataState = initialState(), a: ActionTypes, gridViewState: GridViewState): DataState => {
  switch (a.type) {
    case ActionTypeKeys.IMPORT_DATA:
    case ActionTypeKeys.SET_FROZEN_ROW_IDS:
    case ActionTypeKeys.FREEZE_ROW:
    case ActionTypeKeys.UNFREEZE_ROW:
    case ActionTypeKeys.SET_MULTI_SORT:
    case ActionTypeKeys.UNSORT_COLUMN:
    case ActionTypeKeys.SET_FILTER:
    case ActionTypeKeys.SET_MULTIFILTER:
    case ActionTypeKeys.SET_GLOBAL_FILTER: {
      const changedData: Partial<DataState> = changeData(s, a, gridViewState);
      return {
        ...s,
        ...changedData,
      };
    }
    case ActionTypeKeys.IMPORT_ROW_ID_KEY: {
      return {
        ...s,
        rowIDKey: a.rowIDKey,
      };
    }
    case ActionTypeKeys.SET_CURRENT_PAGE: {
      return {
        ...s,
        currentPage: a.currentPage,
      };
    }
    case ActionTypeKeys.IMPORT_COLUMN_DEFS: {
      return ({
        ...s,
        multiFilter: multiFilter(s.multiFilter, a),
      });
    }
    default: return s;
  }
};

export const initialState = (): DataState => {
  return {
    input: null,
    outputIDs: [],
    frozenRowIDs: [],
    multiSort: [],
    multiFilter: [],
    globalFilter: '',
    allRowIDs: [],
    rowIDKey: null,
    currentPage: 0,
  };
};

export const getInput = (s: DataState): any => {
  return s.input;
};

export const getOutputIDs = (s: DataState): string[] => {
  return s.outputIDs;
};

export const getFrozenRowIDs = (s: DataState): string[] => {
  return s.frozenRowIDs;
};

export const getMultiSort = (s: DataState): SortInfo[] => {
  return s.multiSort;
};

export const getMultiFilter = (s: DataState): string[] => {
  return s.multiFilter;
};

export const getGlobalFilter = (s: DataState): string => {
  return s.globalFilter;
};

export const getAllRowIDs = (s: DataState): string[] => {
  return s.allRowIDs;
};

export const getRowsByID = (s: DataState, IDs: string []): any[] => {
  return IDs.map(ID => s.input[ID]);
};

export const getCurrentPage = (s: DataState): number => {
  return s.currentPage;
};

export const getFrozenRows = createSelector(
  [getFrozenRowIDs, getInput],
  (frozenRowIDs: string[], input: any) => {
    return frozenRowIDs.map(id => input[id]);
  },
);

export default data;
