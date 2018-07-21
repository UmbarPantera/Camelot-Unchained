/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { v4 } from 'uuid';
import multiFilter from './multiFilter';
import { SortInfo, GridViewSort }  from '../../components/GridViewMain';
import { ActionTypeKeys, ActionTypes } from '../actions';
import { GridViewState, getColumnDefs } from '../reducer';
import { DataState, getAllRowIDs, getRowsByID } from '../data';
import frozenRowIDs from './frozenRowIDs';


export const changeData = (s: DataState, a: ActionTypes, gridViewState: GridViewState): Partial<DataState> => {
  const columnDefs = getColumnDefs(gridViewState);
  const keys = columnDefs.map(def => def.key);
  const sortKeys = columnDefs.map(def => def.sortKey ? def.sortKey : def.key);
  switch (a.type) {
    case ActionTypeKeys.IMPORT_DATA: {
      const allRowIDs: string[] = [];
      const importedData: any = {};
      const rowIDKey = a.rowIDKey ? a.rowIDKey : (i: { identifier: string }) => i.identifier;
      a.data.forEach((item) => {
        const id = a.rowIDKey ? a.rowIDKey(item) : v4();
        allRowIDs.push(id);
        importedData[id] = a.rowIDKey ? item : { ...item, identifier: id };
      });
      const outputIDs = calculateOutput(
        importedData,
        allRowIDs,
        s.multiFilter,
        s.globalFilter,
        s.frozenRowIDs,
        s.multiSort,
        keys,
        sortKeys,
        rowIDKey,
      );
      return {
        input: importedData,
        rowIDKey,
        allRowIDs,
        outputIDs,
      };
    }
    case ActionTypeKeys.SET_MULTI_SORT: {
      const outputIDs = calculateOutput(
        s.input,
        getAllRowIDs(s),
        s.multiFilter,
        s.globalFilter,
        s.frozenRowIDs,
        a.sortInfos,
        keys,
        sortKeys,
        s.rowIDKey,
      );
      return {
        multiSort: a.sortInfos,
        outputIDs,
      };
    }
    case ActionTypeKeys.UNSORT_COLUMN: {
      const nextMultiSort = s.multiSort.filter(obj => obj.index !== a.columnIndex);
      if (s.multiSort.length === nextMultiSort.length || s.multiSort[s.multiSort.length - 1].index === a.columnIndex) {
        return ({ multiSort: nextMultiSort });
      }
      const outputIDs = calculateOutput(
        s.input,
        getAllRowIDs(s),
        s.multiFilter,
        s.globalFilter,
        s.frozenRowIDs,
        nextMultiSort,
        keys,
        sortKeys,
        s.rowIDKey,
      );
      return {
        multiSort: nextMultiSort,
        outputIDs,
      };
    }
    case ActionTypeKeys.SET_FILTER: {
      const nextMultiFilter = multiFilter(s.multiFilter, a);
      // if the old filter is part of the new filter we can use the old outputItems and just have to apply the new filter
      const outputIDs = a.filterValue.indexOf(s.multiFilter[a.filterIndex]) === -1
        ? calculateOutput(
          s.input,
          getAllRowIDs(s),
          nextMultiFilter,
          s.globalFilter,
          s.frozenRowIDs,
          s.multiSort,
          keys,
          sortKeys,
          s.rowIDKey,
        )
        : filterItems(getRowsByID(s, s.outputIDs), a.filterValue, keys[a.filterIndex]).map(row => s.rowIDKey(row));
      const currentPage = s.outputIDs === outputIDs ? s.currentPage : 0;
      return {
        multiFilter: nextMultiFilter,
        outputIDs,
        currentPage,
      };
    }
    case ActionTypeKeys.SET_MULTIFILTER: {
      const outputIDs = calculateOutput(
        s.input,
        getAllRowIDs(s),
        a.filterArray,
        s.globalFilter,
        s.frozenRowIDs,
        s.multiSort,
        keys,
        sortKeys,
        s.rowIDKey,
      );
      const currentPage = s.outputIDs === outputIDs ? s.currentPage : 0;
      return {
        multiFilter: a.filterArray,
        outputIDs,
        currentPage,
      };
    }
    // TODO: only recalculate globalFilter, if needed
    case ActionTypeKeys.SET_GLOBAL_FILTER: {
      const outputIDs = calculateOutput(
        s.input,
        getAllRowIDs(s),
        s.multiFilter,
        a.globalFilter,
        s.frozenRowIDs,
        s.multiSort,
        keys,
        sortKeys,
        s.rowIDKey,
      );
      const currentPage = s.outputIDs === outputIDs ? s.currentPage : 0;
      return {
        globalFilter: a.globalFilter,
        outputIDs,
        currentPage,
      };
    }
    case ActionTypeKeys.SET_FROZEN_ROW_IDS:
    case ActionTypeKeys.FREEZE_ROW:
    case ActionTypeKeys.UNFREEZE_ROW: {
      const nextFrozenRowIDs = frozenRowIDs(s.frozenRowIDs, a);
      const outputIDs = calculateOutput(
        s.input,
        getAllRowIDs(s),
        s.multiFilter,
        s.globalFilter,
        nextFrozenRowIDs,
        s.multiSort,
        keys,
        sortKeys,
        s.rowIDKey,
      );
      return {
        frozenRowIDs: nextFrozenRowIDs,
        outputIDs,
      };
    }
    default: return s;
  }
};

const removeFrozenRows = (IDs: string[], frozenRowIDs: string[]): string[] => {
  if (frozenRowIDs.length > 0) {
    const filteredIDs = IDs.filter(id => frozenRowIDs.indexOf(id) === -1);
    return filteredIDs;
  }
  return IDs;
};

const applyFilters = (items: any[], filterArray: string[], keys: any[]): any[] => {
  let nextItems = items.map(item => item);
  keys.forEach((key, index) => {
    if (filterArray[index]) {
      nextItems = filterItems(
        nextItems,
        filterArray[index],
        key,
      );
    }
  });
  return nextItems;
};

const filterItems = (items: any[], filter: string, key: any): any[] => {
  const filteredInput = items.filter((row) => {
    const valueToCheck: any = key(row);
    if (typeof valueToCheck === 'string') return (valueToCheck.indexOf(filter) !== -1);
    if (typeof valueToCheck === 'number') {
      return (valueToCheck.toString().indexOf(filter) !== -1);
    }
    return false;
  });
  return filteredInput;
};

const applyGlobalFilter = (items: any[], globalFilter: string, keys: any[]): any[] => {
  const filteredInput = items.filter((row) => {
    let result = false;
    for (let i = 0; i < keys.length; i++) {
      const typeCheck: any = keys[i](row);
      const valueToCheck = (typeof typeCheck === 'number')
        ? typeCheck.toString()
        : (typeof typeCheck === 'string')
          ? typeCheck : '';
      if (valueToCheck.indexOf(globalFilter) !== -1) {
        result = true;
        break;
      }
    }
    return result;
  });
  return filteredInput;
};

const sortItems = (input: any[], multiSort: SortInfo[], sortKeys: any[]) => {
  if (multiSort.length === 0) return input;
  const nextInput = input.map(input => input);
  const sortFunc = (a: any, b: any) => {
    let i: number = 0;
    while (sortKeys[multiSort[i].index](a) === sortKeys[multiSort[i].index](b)) {
      i++;
      if (multiSort.length === i) return 0;
    }
    if (sortKeys[multiSort[i].index](a) < sortKeys[multiSort[i].index](b)) {
      return multiSort[i].sorted === GridViewSort.Down ? 1 : -1;
    }
    return multiSort[i].sorted === GridViewSort.Down ? -1 : 1;
  };
  return nextInput.sort((a, b) => sortFunc(a, b));
};

const calculateOutput = (
  inputData: any,
  allRowIDs: string[],
  multiFilter: string[],
  globalFilter: string,
  frozenRowIDs: string[],
  multiSort: SortInfo[],
  keys: any[],
  sortKeys: any[],
  rowIDKey: (item: any) => any,
): any[] => {
  if (allRowIDs && allRowIDs.length) {
    // remove frozen rows from output
    const nextRowIDs: string[] = frozenRowIDs ? removeFrozenRows(allRowIDs, frozenRowIDs) : allRowIDs;

    let nextItems = nextRowIDs.map(ID => inputData[ID]);
    // apply multifilters
    nextItems = applyFilters(nextItems, multiFilter, keys);

    // apply global filter
    if (globalFilter) {
      nextItems = applyGlobalFilter(nextItems, globalFilter, keys);
    }

    // sort items
    nextItems = sortItems(
      nextItems,
      multiSort,
      sortKeys,
    );

    return nextItems.map(item => rowIDKey(item));
  }
  return [];
};


export default changeData;
