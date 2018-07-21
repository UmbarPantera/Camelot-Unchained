/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { isEqual, merge } from 'lodash';

import { Quadrant, windowQuadrant } from '@csegames/camelot-unchained/lib/utils/index';
import {  css, cx } from 'react-emotion';
import { RaisedButton } from '@csegames/camelot-unchained';
import {
  GridViewState, getContextMenuVisible, getContextMenuX, getContextMenuY, getContextMenuColumnIndex,
  getContextMenuClickOrigin, getContextMenuTargetElement, getContextMenuRowID, getContextMenuIsFrozenColumn,
  getContextMenuIsFrozenRow, getContextMenuIsSorted, getShowMultiFilters, getAllowExport, getAlterContextMenu,
} from '../reducer/reducer';
import { unsortColumn, onFrozenColumnChanged, freezeRow, unfreezeRow, setShowMultiFilters,
  setContextMenuVisible } from '../reducer/actions';


export interface ContextMenuClassNames {
  contextMenuContainer: string;
  contextMenuButton: React.CSSProperties;
}

export interface ContextMenuStyle {
  contextMenuContainer: React.CSSProperties;
  contextMenuButton: React.CSSProperties;
}


export const contextMenuContainerClass = css`
  background-color: #4d573e;
  border: 1px solid darken(#4d573e, 20%);
  color: #ececec;
  z-index: 9998;
`;

export const defaultContextMenuButtonStyle = {
  borderBottom: '1px solid #222',
  maxWidth: '300px',
};

export interface ContextMenuItem {
  label: string;
  action: () => void;
}

export interface AlterContextMenu {
  currentContextMenuItems: ContextMenuItem[];
  xPosition: number;
  yPosition: number;
  columnIndex: number;
  clickOrigin: string;
  targetElement: EventTarget;
  rowID: string;
  isFrozenColumn: boolean;
  isFrozenRow: boolean;
  isSorted: boolean;
  showMultiFilters: boolean;
  allowExport: boolean;
}

export interface ContextMenuOwnProps {
  exportData: () => void;
  exportTable: () => void;
  classNameObject: Partial<ContextMenuClassNames>;
  offsetLeft?: number;
  offsetRight?: number;
  offsetTop?: number;
  offsetBottom?: number;
}

export interface ContextMenuConnectedProps {
  contextMenuVisible: boolean;
  xPosition: number;
  yPosition: number;
  columnIndex: number;
  clickOrigin: string;
  targetElement: EventTarget;
  rowID: string;
  isFrozenColumn: boolean;
  isFrozenRow: boolean;
  isSorted: boolean;
  showMultiFilters: boolean;
  allowExport: boolean;
  alterContextMenu: (contextMenuInfo: AlterContextMenu) => ContextMenuItem[];
}

export interface ContextMenuProps extends ContextMenuOwnProps, ContextMenuConnectedProps {
  dispatch: (action: any) => void;
}

const select = (state: GridViewState, ownProps: ContextMenuOwnProps): ContextMenuConnectedProps => {
  return {
    contextMenuVisible: getContextMenuVisible(state),
    xPosition: getContextMenuX(state),
    yPosition: getContextMenuY(state),
    columnIndex: getContextMenuColumnIndex(state),
    clickOrigin: getContextMenuClickOrigin(state),
    targetElement: getContextMenuTargetElement(state),
    rowID: getContextMenuRowID(state),
    isFrozenColumn: getContextMenuIsFrozenColumn(state),
    isFrozenRow: getContextMenuIsFrozenRow(state),
    isSorted: getContextMenuIsSorted(state),
    showMultiFilters: getShowMultiFilters(state),
    allowExport: getAllowExport(state),
    alterContextMenu: getAlterContextMenu(state),
  };
};


export class ContextMenu extends React.Component<ContextMenuProps, {}> {

  public static defaultProps: Partial<ContextMenuProps> = {
    offsetBottom: 0,
    offsetLeft: 0,
    offsetRight: 0,
    offsetTop: 0,
  };

  private mouseOverElement = false;

  constructor(props: ContextMenuProps) {
    super(props);
  }

  public render() {
    if (!this.props.contextMenuVisible) return null;
    const contextMenuButtonStyle = merge({}, defaultContextMenuButtonStyle, this.props.classNameObject.contextMenuButton);
    const content = (
      <div>
        {this.renderMenuButtons(contextMenuButtonStyle)}
      </div>
    );

    return (
      <div onContextMenu={e => this.onContextMenu(e)} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
        style={{ display: 'inline-block' }}
      >
        <div
          className={cx(contextMenuContainerClass , this.props.classNameObject.contextMenuContainer)}
          style={this.computeStyle(this.props.xPosition, this.props.yPosition)}
        >
          {content}
        </div>
      </div>
    );
  }

  public renderMenuButtons = (contextMenuButtonStyle: React.CSSProperties) => {

    const menuItems = this.determineContextMenuContent();

    return menuItems.map((item, i) => {
      const action = item.action;
      return (
        <RaisedButton
          key={i}
          styles={{ button: contextMenuButtonStyle }}
          onClick={() => this.onClick(action)}
        >
          {item.label}
        </RaisedButton>
      );
    });
  }

  public componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('mousedown', this.onMouseDown);
  }

  public shouldComponentUpdate(nextProps: ContextMenuProps) {
    return !isEqual(nextProps, this.props);
  }

  public hide = () => {
    this.props.dispatch(setContextMenuVisible(false));
    // window.removeEventListener('keydown', this.onKeyDown);
    // window.removeEventListener('mousedown', this.onMouseDown);
  }

  /*public show = () => {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('mousedown', this.onMouseDown);
  }*/

  public componentWillUnmount() {
    // unreg window handlers
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('mousedown', this.onMouseDown);
  }

  private onClick = (action: any) => {
    action();
    this.hide();
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.which === 27 && this.props.contextMenuVisible) {
      // escape, close this
      this.hide();
    }
  }

  private onMouseDown = (e: MouseEvent) => {
    if (!this.mouseOverElement && this.props.contextMenuVisible) {
      this.hide();
    }
  }

  private onMouseEnter = () => {
    this.mouseOverElement = true;
  }

  private onMouseLeave = () => {
    this.mouseOverElement = false;
  }

  private onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    // closes the context menu, if pointer is over the menu and right click
    e.preventDefault();
    this.hide();
  }

  private determineContextMenuContent = (): ContextMenuItem[] => {
    const defaultContextMenuItems: ContextMenuItem[] = [];
    if (this.props.clickOrigin === 'Header') {
      const indexOrigin = this.props.columnIndex;
      // unsort
      if (this.props.isSorted) {
        defaultContextMenuItems.push({ label: 'unsort', action: () => this.props.dispatch(unsortColumn(indexOrigin)) });
      }
      // (un-)freeze column
      if (!this.props.isFrozenColumn) {
        defaultContextMenuItems.push(
          { label: 'freeze', action: () => this.props.dispatch(onFrozenColumnChanged(indexOrigin)) },
        );
      } else {
        defaultContextMenuItems.push(
          { label: 'unfreeze', action: () => this.props.dispatch(onFrozenColumnChanged(indexOrigin)) },
        );
      }
      // show/hide multi filter fields
      if (!this.props.showMultiFilters) {
        defaultContextMenuItems.push(
          { label: 'show filters', action: () => this.props.dispatch(setShowMultiFilters(true)) },
        );
      } else {
        defaultContextMenuItems.push(
          { label: 'hide filters', action: () => this.props.dispatch(setShowMultiFilters(false)) },
        );
      }
    } else {
      // (un-)freeze row
      if (!this.props.isFrozenRow) {
        defaultContextMenuItems.push(
          { label: 'freeze', action: () => this.props.dispatch(freezeRow(this.props.rowID)) },
        );
      } else {
        defaultContextMenuItems.push(
          { label: 'unfreeze', action: () => this.props.dispatch(unfreezeRow(this.props.rowID)) },
        );
      }
    }
    // export data
    if (this.props.allowExport) {
      defaultContextMenuItems.push({ label: 'export data', action: () => this.props.exportData() });
      defaultContextMenuItems.push({ label: 'export table', action: () => this.props.exportTable() });
    }

    const {
      xPosition,
      yPosition,
      columnIndex,
      clickOrigin,
      targetElement,
      rowID,
      isFrozenColumn,
      isFrozenRow,
      isSorted,
      showMultiFilters,
      allowExport,
    } = this.props;

    const contextMenuItems = this.props.alterContextMenu
      ? this.props.alterContextMenu({
        currentContextMenuItems: defaultContextMenuItems,
        xPosition,
        yPosition,
        columnIndex,
        clickOrigin,
        targetElement,
        rowID,
        isFrozenColumn,
        isFrozenRow,
        isSorted,
        showMultiFilters,
        allowExport,
      })
      : defaultContextMenuItems;

    // create a default menu item with label <empty>, if no menuItems were provided, for better feedback
    if (!contextMenuItems.length) defaultContextMenuItems.push({ label: '<empty>', action: () => 0 });

    return contextMenuItems;
  }

  private computeStyle = (clientX: number, clientY: number): React.CSSProperties => {
    const wndRegion: Quadrant = windowQuadrant(clientX, clientY);
    switch (wndRegion) {
      case Quadrant.TopLeft:
        return {
          position: 'fixed',
          left: `${this.props.xPosition + this.props.offsetLeft}px`,
          top: `${this.props.yPosition + this.props.offsetTop}px`,
        };
      case Quadrant.TopRight:
        return {
          position: 'fixed',
          right: `${window.window.innerWidth - this.props.xPosition + this.props.offsetRight}px`,
          top: `${this.props.yPosition + this.props.offsetTop}px`,
        };
      case Quadrant.BottomLeft:
        return {
          position: 'fixed',
          left: `${this.props.xPosition + this.props.offsetLeft}px`,
          bottom: `${window.window.innerHeight - this.props.yPosition + this.props.offsetBottom}px`,
        };
      case Quadrant.BottomRight:
        return {
          position: 'fixed',
          right: `${window.window.innerWidth - this.props.xPosition + this.props.offsetRight}px`,
          bottom: `${window.window.innerHeight - this.props.yPosition + this.props.offsetBottom}px`,
        };
    }
  }
}

export default connect(select)(ContextMenu);
