/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
// import styled from 'react-emotion';
import { ColumnGroupType, ExtendedColumnDef, GridViewClassNames } from './GridViewMain';
import * as Reducer from '../reducer/reducer';
import Header from './Header';
import MultiFilter from './MultiFilter';
import Grid from './Grid';
import { setRowHeight } from '../reducer/actions';
// import { shallowDiffersWithLog } from '../utils';


export interface ColumnGroupConnectedProps {
  hasExpander: boolean;
  frozenRows: any[];
  scrollableRows: any[];
  xScrollPosition: number;
  columnStyles: React.CSSProperties[];
  selectedRows: string[];
  expandedRows: string[];
  scrollbarWidth: number;
  needsRowHeight: boolean;
  leftXPlaceholderWidth: number;
  rightXPlaceholderWidth: number;
}

export interface ColumnGroupOwnProps {
  columnGroupType: ColumnGroupType;
  classNameObject: GridViewClassNames;
  scrollable: boolean;
  columnDefs: ExtendedColumnDef[];
  xScrollbarVisible: boolean;
  yScrollbarVisible: boolean;
  onScroll: (yScrollPosition: number) => void;
  handleMouseDownColumnResizer: (event: React.MouseEvent<HTMLDivElement>, columnIndex: number) => void;
  handleMouseDownColumnHeader: (event: React.MouseEvent<HTMLDivElement>, columnIndex: number) => void;
  columnRefs: (columnRef: HTMLDivElement, index: number) => void;
  gridContainerRef: (gridContainerRef: HTMLDivElement) => void;
  hasOutput: boolean;
  rowExpansionRef?: (rowExpansionRef: HTMLDivElement) => void;
}

export interface ColumnGroupProps extends ColumnGroupOwnProps, ColumnGroupConnectedProps {
  dispatch: (action: any) => void;
}

const select = (state: Reducer.GridViewState, ownProps: ColumnGroupOwnProps): ColumnGroupConnectedProps => {
  return {
    hasExpander: Reducer.getHasExpander(state, ownProps.columnGroupType),
    frozenRows: Reducer.getFrozenRows(state),
    scrollableRows: Reducer.getScrollableRows(state),
    xScrollPosition: ownProps.columnGroupType === ColumnGroupType.Scrollable ? Reducer.getXScrollPosition(state) : 0,
    columnStyles: Reducer.getColumnStyles(state),
    selectedRows: Reducer.getSelectedRowIDs(state),
    expandedRows: Reducer.getExpandedRowIDs(state),
    scrollbarWidth: Reducer.getScrollbarWidth(state),
    needsRowHeight: ownProps.scrollable
      // && !ownProps.frozenRows
      && ownProps.columnGroupType !== ColumnGroupType.Dummy
      && !Reducer.getRowHeight(state),
    leftXPlaceholderWidth: Reducer.getLeftXPlaceholderWidth(state),
    rightXPlaceholderWidth: Reducer.getRightXPlaceholderWidth(state),
  };
};

export class ColumnGroup extends React.Component<ColumnGroupProps, {}> {
  private gridRef: HTMLDivElement = null;

  constructor(props: ColumnGroupProps) {
    super(props);
  }

  public render() {
    // console.log('rendering ColumnGroup');
    const props = this.props;
    const flexSettings = props.scrollable && props.columnGroupType !== ColumnGroupType.Dummy
      ? props.columnDefs.length + ' 1 auto'
      : props.columnDefs.length + ' 0 auto';
    const marginRight = props.yScrollbarVisible ? props.scrollbarWidth : 0;
    const needPlaceholders = props.columnGroupType === ColumnGroupType.Scrollable && props.xScrollbarVisible;

    const headerContainer = (
      <div className={props.classNameObject.headerContainer}
        style={props.scrollable && props.columnGroupType !== ColumnGroupType.Dummy
          ? {
            marginLeft: '-' + props.xScrollPosition + 'px',
            marginRight: marginRight + 'px',
          }
          : {}}
      >
        {needPlaceholders && props.leftXPlaceholderWidth > 0 && <div
          key={'xPlaceholderLeft'}
          style={{
            minWidth: props.leftXPlaceholderWidth,
          }}
        />}
        <div className={props.classNameObject.preGridContainer}>
          <Header
            columnDefs={props.columnDefs}
            columnGroupType={props.columnGroupType}
            handleMouseDownResize={(e: React.MouseEvent<HTMLDivElement>, columnIndex: number) =>
              props.handleMouseDownColumnResizer(e, columnIndex)}
            handleMouseDownReorder={(e: React.MouseEvent<HTMLDivElement>, columnIndex: number) =>
              props.handleMouseDownColumnHeader(e, columnIndex)}
            columnRef={props.columnRefs}
            classNameObject={props.classNameObject}
          />
          <MultiFilter
            columnGroupType={props.columnGroupType}
            columnDefs={props.columnDefs}
            classNameObject={props.classNameObject}
          />
          <div className={props.classNameObject.headerSeparator}/>
          {props.frozenRows.length > 0 && <Grid
            columnGroupType={props.columnGroupType}
            columnDefs={props.columnDefs}
            columnStyles={props.columnStyles}
            items={props.frozenRows}
            scrollableTablePart={props.scrollable}
            areFrozenRows={true}
            gridRef={this.getGridRef}
            classNameObject={props.classNameObject}
            yScrollbarVisible={props.yScrollbarVisible}
            rowExpansionRef={props.rowExpansionRef}
          />}
        </div>
        {needPlaceholders && <div
          key={'xPlaceholderRight'}
          style={{
            display: 'flex',
            minWidth: props.rightXPlaceholderWidth,
          }}
        />}
      </div>
    );

    return (
     <div
       className={props.classNameObject.tableContainer}
       style={{ flex: flexSettings }}
     >
       {headerContainer}
       <Grid
         columnGroupType={props.columnGroupType}
         columnDefs={props.columnDefs}
         columnStyles={props.columnStyles}
         items={props.scrollableRows}
         scrollableTablePart={props.scrollable}
         areFrozenRows={false}
         onScroll={props.onScroll}
         gridRef={this.getGridRef}
         gridContainerRef={props.gridContainerRef}
         classNameObject={props.classNameObject}
         yScrollbarVisible={props.yScrollbarVisible}
         rowExpansionRef={props.rowExpansionRef}
       />
     </div>
    );
  }

  public componentDidMount() {
    if (this.props.needsRowHeight && this.gridRef && this.props.hasOutput) {
      this.getRowHeight();
      // this.props.dispatch(
      //   setRowHeight(this.gridRef.firstChild.firstChild.firstChild.parentElement.getBoundingClientRect().height),
      // );
      // setTimeout(() => this.props.dispatch(
      //   setRowHeight(this.gridRef.firstChild.firstChild.firstChild.parentElement.getBoundingClientRect().height),
      // ), 0);
    }
  }

  // public shouldComponentUpdate(nextProps: ColumnGroupProps) {
  //   console.log('ColumnGroupUpdate');
  //   shallowDiffersWithLog(this.props, nextProps);
  //   return true;
  // }

  public componentDidUpdate() {
    if (this.props.needsRowHeight && this.gridRef && this.props.hasOutput) {
      this.getRowHeight();
    }
  }

  private getRowHeight = () => {
    if (this.gridRef && this.gridRef.firstChild && this.gridRef.firstChild.firstChild) {
      const rowHeight = this.gridRef.firstChild.firstChild.firstChild.parentElement.getBoundingClientRect().height;
      if (rowHeight) {
        this.props.dispatch(setRowHeight(rowHeight));
      } else {
        setTimeout(() => this.getRowHeight(), 50);
      }
    } else {
      setTimeout(() => this.getRowHeight(), 50);
    }
  }

  private getGridRef = (r: HTMLDivElement) => { if (this.props.needsRowHeight) this.gridRef = r; };

}

export default connect(select)(ColumnGroup);
