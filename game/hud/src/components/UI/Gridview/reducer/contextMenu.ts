/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionTypeKeys, ActionTypes } from './actions';

export interface ContextMenuState {
  contextMenuVisible: boolean;
  xPosition: number;
  yPosition: number;
  columnIndex: number;
  clickOrigin: string;
  targetElement: EventTarget;
  isFrozenColumn: boolean;
  rowID?: string;
  isSorted?: boolean;
  isFrozenRow?: boolean;
}

export const contextMenu = (s: ContextMenuState, a: ActionTypes): ContextMenuState => {
  switch (a.type) {
    case ActionTypeKeys.ON_HEADER_CONTEXT_MENU: {
      return ({
        contextMenuVisible: a.contextMenuVisible,
        xPosition: a.xPosition,
        yPosition: a.yPosition,
        columnIndex: a.columnIndex,
        clickOrigin: a.clickOrigin,
        targetElement: a.targetElement,
        isFrozenColumn: a.isFrozenColumn,
        isSorted: a.isSorted || false,
      });
    }
    case ActionTypeKeys.ON_GRID_CONTEXT_MENU: {
      return ({
        contextMenuVisible: a.contextMenuVisible,
        xPosition: a.xPosition,
        yPosition: a.yPosition,
        columnIndex: a.columnIndex,
        clickOrigin: a.clickOrigin,
        targetElement: a.targetElement,
        isFrozenColumn: a.isFrozenColumn,
        rowID: a.rowID,
        isFrozenRow: a.isFrozenRow,
      });
    }
    case ActionTypeKeys.SET_CONTEXT_MENU_VISIBLE: {
      return ({
        ...s,
        contextMenuVisible: a.contextMenuVisible,
      });
    }
    default: return s;
  }
};

export const initialState = (): ContextMenuState => {
  return ({
    contextMenuVisible: false,
    xPosition: 0,
    yPosition: 0,
    columnIndex: 0,
    clickOrigin: '',
    targetElement: null,
    isFrozenColumn: false,
    rowID: '',
    isSorted: false,
    isFrozenRow: false,
  });
};

export const getContextMenuVisible = (s: ContextMenuState): boolean => {
  return s.contextMenuVisible;
};

export const getContextMenuX = (s: ContextMenuState): number => {
  return s.xPosition;
};

export const getContextMenuY = (s: ContextMenuState): number => {
  return s.yPosition;
};

export const getContextMenuColumnIndex = (s: ContextMenuState): number => {
  return s.columnIndex;
};

export const getContextMenuClickOrigin = (s: ContextMenuState): string => {
  return s.clickOrigin;
};

export const getContextMenuTargetElement = (s: ContextMenuState): EventTarget => {
  return s.targetElement;
};

export const getContextMenuIsFrozenColumn = (s: ContextMenuState): boolean => {
  return s.isFrozenColumn;
};

export const getContextMenuRowID = (s: ContextMenuState): string => {
  return s.rowID;
};

export const getContextMenuIsSorted = (s: ContextMenuState): boolean => {
  return s.isSorted;
};

export const getContextMenuIsFrozenRow = (s: ContextMenuState): boolean => {
  return s.isFrozenRow;
};

export default contextMenu;
