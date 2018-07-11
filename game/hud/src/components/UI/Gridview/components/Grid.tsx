/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import styled, { cx, css } from 'react-emotion';
import { ExtendedColumnDef, ColumnGroupType, GridViewClassNames } from './GridViewMain';
import Row from './Row';
import {
  GridViewState, getRenderData, getYScrollPosition, getReorderColumn, getColumnReordering, getRowExpansionTemplate,
  getHasExpander, getRowIDKey, getSelectedRowIDs, getExpandedRowIDs, getScrollbarWidth, getXScrollbarVisible, getRowHeight,
  getGridHeight, getVirtualYScrollIndex, getScrollContainerHeight, getLeftXPlaceholderWidth, getRightXPlaceholderWidth,
  getRowExpansionHeight, getAllowVirtualYScrolling, getTopPlaceholderHeight, getVirtualExpandedRows, getItemsPPP,
  getLastAction,
} from '../reducer/reducer';
import { onGridContextMenu, ActionTypes, ActionTypeKeys } from '../reducer/actions';
// import { shallowDiffersWithLog } from '../utils';



export interface GridConnectedProps {
  renderData: any;
  yScrollPosition: number;
  reorderColumnIndex: number;
  columnReordering: boolean;
  rowExpansionTemplate: (items: any, columnGroupType: ColumnGroupType) => JSX.Element;
  hasExpander: boolean;
  rowIDKey: (item: any) => any;
  selectedRowIDs: string[];
  expandedRowIDs: string[];
  scrollbarWidth: number;
  xScrollbarVisible: boolean;
  rowHeight: number;
  rowExpansionHeight: number;
  gridHeight: number;
  virtualYScrollIndex: number;
  scrollContainerHeight: number;
  leftXPlaceholderWidth: number;
  rightXPlaceholderWidth: number;
  itemsPerPage: number;
  allowVirtualYScrolling: boolean;
  topPlaceholderHeight: number;
  virtualExpandedRows: boolean;
  lastAction: ActionTypes;
}

export interface GridOwnProps {
  columnGroupType: ColumnGroupType;
  columnDefs: ExtendedColumnDef[];
  columnStyles: React.CSSProperties[];
  items: any[];
  scrollableTablePart: boolean;
  areFrozenRows: boolean;
  gridRef: (r: HTMLDivElement) => void;
  classNameObject: GridViewClassNames;
  gridContainerRef?: (r: HTMLDivElement) => void; // needed on the scroll container
  onScroll?: (yScrollPosition: number) => void; // needed on the scroll container
  yScrollbarVisible: boolean;
  rowExpansionRef?: (rowExpansionRef: HTMLDivElement) => void;
}

export interface GridProps extends GridOwnProps, GridConnectedProps {
  dispatch: (action: any) => void;
}

const select = (state: GridViewState, ownProps: GridOwnProps): GridConnectedProps => {
  return ({
    renderData: getRenderData(state),
    yScrollPosition: !ownProps.areFrozenRows && ownProps.columnGroupType !== ColumnGroupType.Dummy
      ? getYScrollPosition(state)
      : 0,
    reorderColumnIndex: getReorderColumn(state),
    columnReordering: getColumnReordering(state),
    rowExpansionTemplate: getRowExpansionTemplate(state),
    hasExpander: getHasExpander(state, ownProps.columnGroupType),
    rowIDKey: getRowIDKey(state),
    selectedRowIDs: getSelectedRowIDs(state),
    expandedRowIDs: getExpandedRowIDs(state),
    scrollbarWidth: getScrollbarWidth(state),
    xScrollbarVisible: getXScrollbarVisible(state),
    rowHeight: ownProps.items.length ? getRowHeight(state) : null,
    rowExpansionHeight: getRowExpansionHeight(state),
    gridHeight: getGridHeight(state),
    virtualYScrollIndex: getVirtualYScrollIndex(state),
    scrollContainerHeight: getScrollContainerHeight(state),
    leftXPlaceholderWidth: getLeftXPlaceholderWidth(state),
    rightXPlaceholderWidth: getRightXPlaceholderWidth(state),
    itemsPerPage: getItemsPPP(state), // ownProps.xScrollbarVisible ? getItemsPPPWScrollbar(state) : getItemsPPP(state),
    allowVirtualYScrolling: getAllowVirtualYScrolling(state),
    topPlaceholderHeight: getTopPlaceholderHeight(state),
    virtualExpandedRows: getVirtualExpandedRows(state),
    lastAction: getLastAction(state),
  });
};

const RowContainer = styled('div') `
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
`;


export class Grid extends React.Component<GridProps, {}> {
  private gridContainerRef: HTMLDivElement = null;

  constructor(props: GridProps) {
    super(props);
  }

  public render() {
    const props = this.props;
    const isScrollContainer = props.columnGroupType === ColumnGroupType.Scrollable && !props.areFrozenRows;
    const rows: JSX.Element[] = !props.areFrozenRows && props.allowVirtualYScrolling
      ? this.getVirtualRows()
      : props.items.map((item) => {
        const rowID = props.rowIDKey(item);
        return (
          <Row
            key={rowID}
            columnGroupType={props.columnGroupType}
            item={item}
            defs={props.columnDefs}
            columnStyles={props.columnStyles}
            renderData={props.renderData}
            rowIDKey={props.rowIDKey}
            onContextMenu={this.onContextMenu}
            columnReordering={props.columnReordering}
            selectedRowIDs={props.selectedRowIDs}
            reorderColumnIndex={props.reorderColumnIndex}
            rowExpansionTemplate={props.rowExpansionTemplate}
            showRowExpansion={props.expandedRowIDs.indexOf(rowID) !== -1}
            hasExpander={props.hasExpander}
            scrollableTablePart={props.scrollableTablePart}
            classNameObject={props.classNameObject}
            rowExpansionRef={props.rowExpansionRef}
          />
        );
      });

    const needPlaceholders = props.columnGroupType === ColumnGroupType.Scrollable
      && !props.areFrozenRows
      && props.xScrollbarVisible;
    return (
      <div
        className={cx(
          props.classNameObject.gridContainer,
          isScrollContainer && props.xScrollbarVisible && props.classNameObject.gridContainerXScroll,
          isScrollContainer && props.yScrollbarVisible && props.classNameObject.gridContainerYScroll,
          props.areFrozenRows && props.classNameObject.frozen,
        )}
        style={props.xScrollbarVisible
          && !props.areFrozenRows
          && props.columnGroupType === ColumnGroupType.Frozen
          ? { marginBottom: props.scrollbarWidth + 'px' }
          : {}
        }
        ref={(r) => { if (props.gridContainerRef) { props.gridContainerRef(r); this.gridContainerRef = r; } }}
        onScroll={() => props.onScroll(props.yScrollPosition)}
      >
        <div
          className={cx(
            props.classNameObject.grid,
            isScrollContainer && css`
              min-height: ${props.gridHeight}px;
            `,
          )}
          style={
            props.columnGroupType === ColumnGroupType.Frozen && !props.areFrozenRows && props.yScrollbarVisible
              ? { marginTop: '-' + props.yScrollPosition + 'px' }
              : {}
          }
          ref={(r) => { if (isScrollContainer) props.gridRef(r); }}
        >
          {needPlaceholders && props.leftXPlaceholderWidth > 0 && <div
            key={'xPlaceholderLeft'}
            style={{
              minWidth: props.leftXPlaceholderWidth,
            }}
          />}
          <RowContainer>
            {rows}
          </RowContainer>
          {needPlaceholders && <div
            key={'xPlaceholderRight'}
            style={{
              display: 'flex',
              minWidth: props.rightXPlaceholderWidth,
            }}
          />}
        </div>
      </div>
    );
  }

  // public shouldComponentUpdate(nextProps: GridProps) {
  //   console.log('GridUpdate');
  //   const shouldUpdate = shallowDiffersWithLog(this.props, nextProps);
  //   return shouldUpdate;
  // }

  public componentDidUpdate(prevProps: GridProps) {
    // need to update the scroll position after the new grid has rendered because we have to wait till the scroll bar
    // adapted to the new length of the grid
    // only the scrollContainer has this.gridContainerRef so we do not need
    // && props.scrollableTablePart && !props.areFrozenRows
    if (
      this.props.lastAction.type !== ActionTypeKeys.SET_Y_SCROLL_POSITION
      && this.gridContainerRef
      && this.props.yScrollPosition !== this.gridContainerRef.scrollTop
    ) {
      this.gridContainerRef.scrollTop = this.props.yScrollPosition;
    }
  }

  private onContextMenu = (e: React.MouseEvent<HTMLSpanElement>, columnIndex: number, rowID: string) => {
    // console.log('onContextMenu');
    e.preventDefault();
    const isFrozenColumn = this.props.columnGroupType === ColumnGroupType.Frozen;
    this.props.dispatch(
      onGridContextMenu(
        true,
        e.clientX,
        e.clientY,
        columnIndex,
        'Grid',
        e.target,
        rowID,
        isFrozenColumn,
        this.props.areFrozenRows,
      ),
    );
  }

  private getVirtualRows = (): JSX.Element[] => {
    const props = this.props;
    const totalHeight = props.virtualExpandedRows ? props.rowHeight + props.rowExpansionHeight : props.rowHeight;
    const virtualRows: JSX.Element[] = [];
    if (props.topPlaceholderHeight) {
      virtualRows.push(
        <div
          key={'Placeholder Top'}
          style={{ height: props.topPlaceholderHeight }}
        />,
      );
    }
    let i;
    const itemsPerPage = props.itemsPerPage + 2;
    for (i = props.virtualYScrollIndex; i < props.virtualYScrollIndex + itemsPerPage && i < props.items.length; i++) {
      virtualRows.push(
        <Row
          key={props.rowIDKey(props.items[i])}
          columnGroupType={props.columnGroupType}
          item={props.items[i]}
          defs={props.columnDefs}
          columnStyles={props.columnStyles}
          renderData={props.renderData}
          rowIDKey={props.rowIDKey}
          onContextMenu={this.onContextMenu}
          columnReordering={props.columnReordering}
          selectedRowIDs={props.selectedRowIDs}
          reorderColumnIndex={props.reorderColumnIndex}
          rowExpansionTemplate={props.rowExpansionTemplate}
          showRowExpansion={props.virtualExpandedRows}
          hasExpander={props.hasExpander}
          scrollableTablePart={props.scrollableTablePart}
          classNameObject={props.classNameObject}
          rowExpansionRef={props.rowExpansionRef}
        />,
      );
    }
    const remainingHeight = props.gridHeight - props.topPlaceholderHeight - (i - props.virtualYScrollIndex) * totalHeight;
    virtualRows.push(
      <div
        key={'Placeholder Bottom'}
        style={{ height: remainingHeight }}
      />,
    );

    return virtualRows;
  }

}

export default connect(select)(Grid);
