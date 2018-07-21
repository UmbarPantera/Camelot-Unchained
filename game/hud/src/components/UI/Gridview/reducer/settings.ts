/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { merge } from 'lodash';
import { ActionTypeKeys, ActionTypes } from './actions';
import { ColumnGroupType } from '../components/GridViewMain';
import { ContextMenuItem, AlterContextMenu } from '../components/ContextMenu';

export const initialState = (): SettingState => {
  return {
    renderData: {},
    rowExpansionTemplate: null,
    alterContextMenu: null,
    rowIDKey: (r: { identifier: string }) => r.identifier,
    resizeableColumns: false,
    fixedTableWidth: true,
    reorderableColumns: false,
    allowXScrollbar: true,
    allowYScrollbar: true,
    calculateItemsPerPage: false,
    selectableRows: false,
    allowExport: false,
    allowVirtualYScrolling: true,
  };
};

export const settings = (s: SettingState = initialState(), a: ActionTypes): SettingState => {
  switch (a.type) {
    case ActionTypeKeys.IMPORT_SETTINGS: {
      const settings: any = {};
      for (const obj in a.settings) {
        const skip: string[] = [
          'type',
          'dispatch',
          'data',
          'items',
          'columnDefinitions',
          'multiSort',
          'filterArray',
          'frozenRows',
          'showMultiFilters',
          'rowIDKey',
        ];
        if (skip.indexOf(obj) === -1 && typeof a.settings[obj] !== 'undefined') {
          settings[obj] = a.settings[obj];
        }
      }
      return merge({}, s, settings);
    }
    case ActionTypeKeys.IMPORT_DATA: {
      const rowIDKey = a.rowIDKey ? a.rowIDKey : (r: { identifier: string }) => r.identifier;
      return ({
        ...s,
        rowIDKey,
      });
    }
    default: return s;
  }
};

export interface SettingState {
  renderData?: {
    [id: string]: any,
  };
  rowExpansionTemplate?: (items: any, columnGroupType: ColumnGroupType) => JSX.Element;
  // userPermissions?: ql.PermissionInfo[];
  alterContextMenu?: (contextMenuInfo: AlterContextMenu) => ContextMenuItem[];
  rowIDKey?: (item: any) => any;
  resizeableColumns?: boolean;
  fixedTableWidth?: boolean;
  reorderableColumns?: boolean;
  allowXScrollbar?: boolean;
  allowYScrollbar?: boolean;
  calculateItemsPerPage?: boolean;
  selectableRows?: boolean;
  allowExport?: boolean;
  allowVirtualYScrolling?: boolean;
}

export const getRenderData = (s: SettingState): { [id: string]: any } => {
  return s.renderData;
};

export const getRowExpansionTemplate = (s: SettingState): (items: any, columnGroupType: ColumnGroupType) => JSX.Element => {
  return s.rowExpansionTemplate;
};

export const getAlterContextMenu = (s: SettingState): (contextMenuInfo: AlterContextMenu) => ContextMenuItem[] => {
  return s.alterContextMenu;
};

export const getRowIDKey = (s: SettingState): (item: any) => any => {
  return s.rowIDKey;
};

export const getResizeableColumns = (s: SettingState): boolean => {
  return s.resizeableColumns;
};

export const getFixedTableWidth = (s: SettingState): boolean => {
  return s.fixedTableWidth;
};

export const getReorderableColumns = (s: SettingState): boolean => {
  return s.reorderableColumns;
};

export const getAllowXScrollbar = (s: SettingState): boolean => {
  return s.allowXScrollbar;
};

export const getAllowYScrollbar = (s: SettingState): boolean => {
  return s.allowYScrollbar;
};

export const getCalculateItemsPerPage = (s: SettingState): boolean => {
  return s.calculateItemsPerPage;
};

export const getSelectableRows = (s: SettingState): boolean => {
  return s.selectableRows;
};

export const getAllowExport = (s: SettingState): boolean => {
  return s.allowExport;
};

export const getAllowVirtualYScrolling = (s: SettingState): boolean => {
  return s.allowVirtualYScrolling;
};

export default settings;
