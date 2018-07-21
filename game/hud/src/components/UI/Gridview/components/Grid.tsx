/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import styled, { cx } from 'react-emotion';
import { ExtendedColumnDef, ColumnGroupType, GridViewClassNames } from './GridViewMain';
import Row from './Row';
import {
  GridViewState, getRenderData, getYScrollPosition, getReorderColumn, getColumnReordering, getRowExpansionTemplate,
  getHasExpander, getRowIDKey, getSelectedRowIDs, getExpandedRowIDs, getScrollbarWidth, getXScrollbarVisible, getRowHeight,
  getGridHeight, getVirtualYScrollIndex, getScrollContainerHeight, getLeftXPlaceholderWidth, getRightXPlaceholderWidth,
  getRowExpansionHeight, getAllowVirtualYScrolling, getTopPlaceholderHeight, getVirtualExpandedRows, getItemsPPP,
  getLastAction, getXScrollPosition,
} from '../reducer/reducer';
import { onGridContextMenu, ActionTypes, ActionTypeKeys, setXScrollPosition, setYScrollPosition } from '../reducer/actions';
// import { shallowDiffersWithLog } from '../utils';



export interface GridConnectedProps {
  renderData: any;
  xScrollPosition: number;
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
  yScrollbarVisible: boolean;
  rowExpansionRef?: (rowExpansionRef: HTMLDivElement) => void;
}

export interface GridProps extends GridOwnProps, GridConnectedProps {
  dispatch: (action: any) => void;
}

export interface GridState {
  isScrolling: boolean;
}

const select = (state: GridViewState, ownProps: GridOwnProps): GridConnectedProps => {
  return ({
    renderData: getRenderData(state),
    xScrollPosition: ownProps.columnGroupType === ColumnGroupType.Scrollable
      ? getXScrollPosition(state)
      : 0,
    yScrollPosition: !ownProps.areFrozenRows
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


export class Grid extends React.Component<GridProps, GridState> {
  private gridContainerRef: HTMLDivElement = null;
  private gridRef: HTMLDivElement = null;
  private scrollTimeout: any = null;

  constructor(props: GridProps) {
    super(props);
    this.state = {
      isScrolling: false,
    };
  }

  public render() {
    // console.log('Grid');
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
      >
        <div
          className={props.classNameObject.grid}
          style={{
            marginTop: props.columnGroupType !== ColumnGroupType.Scrollable
              && !props.areFrozenRows
              && props.yScrollbarVisible
              && '-' + props.yScrollPosition + 'px',
            minHeight: isScrollContainer && props.gridHeight,
            pointerEvents: this.state.isScrolling ? 'none' : 'all',
          }}
          ref={(r) => { if (isScrollContainer) { props.gridRef(r); this.gridRef = r; } }}
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

  public componentDidMount() {
    if (this.gridContainerRef) {
      this.gridContainerRef.addEventListener('scroll', this.onScroll, { passive: true });
      this.gridRef.addEventListener('wheel', this.onScrollStart, { passive: true });
      this.gridContainerRef.scrollTop = this.props.yScrollPosition;
      this.gridContainerRef.scrollLeft = this.props.xScrollPosition;
    }
  }

  public componentWillUnmount() {
    if (this.gridContainerRef) {
      this.gridContainerRef.removeEventListener('scroll', this.onScroll);
      this.gridRef.removeEventListener('wheel', this.onScrollStart);
    }
  }

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

  private onScrollStart = () => {
    if (!this.state.isScrolling && (this.props.lastAction.type === ActionTypeKeys.SET_Y_SCROLL_POSITION)) {
      // console.log('start');
      this.setState({
        isScrolling: true,
      });
    }
  }

  private onScrollEnd = () => {
    if (this.state.isScrolling) {
      this.setState({
        isScrolling: false,
      });
      // console.log('end');
      // console.log(this.scrollTimeout);
    }
  }

  private onScroll = (e?: any) => {
    // console.log(e.target);
    const nextYScrollPosition = e ? e.target.scrollTop : this.gridContainerRef.scrollTop;

    if (!this.state.isScrolling) this.onScrollStart();
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    if (nextYScrollPosition !== this.props.yScrollPosition) {
      this.props.dispatch(setYScrollPosition(nextYScrollPosition));
    } else {
      const nextXScrollPosition = e ? e.target.scrollLeft : this.gridContainerRef.scrollLeft;
      if (nextXScrollPosition !== this.props.xScrollPosition) {
        this.props.dispatch(setXScrollPosition(nextXScrollPosition));
      }
    }

    this.scrollTimeout = setTimeout(() => {
      this.onScrollEnd();
    }, 5);
  }
}

export default connect(select)(Grid);
