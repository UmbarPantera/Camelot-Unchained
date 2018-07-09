/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import ContextMenu, { ContextMenuStyle, ContextMenuClassNames } from './ContextMenu';
import Paginator, { PaginatorStyle, PaginatorClassnames } from './Paginator';
import ColumnGroup from './ColumnGroup';
import * as Reducer from '../reducer/reducer';
import * as Action /*{ importColumnDefs, importData, importSettings, setFilter } */from '../reducer/actions';
import { setTimeout } from 'timers';
// import { shallowDiffersWithLog } from '../utils';
// import { ql } from '..';

export interface GridViewClassNames {
  container: string;
  tableWrapper: string;
  tableContainer: string;
  headerContainer: string;
  preGridContainer: string;
  header: string;
  headerItem: string;
  reorderHeaderItem: string;
  headerElements: string;
  headerName: string;
  sortPrio: string;
  columnResizer: string;
  filter: string;
  filterItem: string;
  filterInput: React.CSSProperties;
  filterInputWrapper: React.CSSProperties;
  reorderFilterItem: string;
  headerSeparator: string;
  gridContainer: string;
  gridContainerXScroll: string;
  gridContainerYScroll: string;
  grid: string;
  gridItem: string;
  reorderGridItem: string;
  row: string;
  expandableRow: string;
  expandedRow: string;
  noReorder: string;
  resizeLine: string;
  reorderColumn: string;
  selected: string;
  frozen: string;
  selectedFrozen: string;
  rowExtender: string;
  paginator?: Partial<PaginatorClassnames>;
  contextMenu?: Partial<ContextMenuClassNames>;
}

export interface GridViewStyle {
  container: React.CSSProperties;
  tableWrapper: React.CSSProperties;
  tableContainer: React.CSSProperties;
  headerContainer: React.CSSProperties;
  preGridContainer: React.CSSProperties;
  header: React.CSSProperties;
  headerItem: React.CSSProperties;
  reorderHeaderItem: React.CSSProperties;
  headerElements: React.CSSProperties;
  headerName: React.CSSProperties;
  sortPrio: React.CSSProperties;
  columnResizer: React.CSSProperties;
  filter: React.CSSProperties;
  filterItem: React.CSSProperties;
  filterInputWrapper: React.CSSProperties;
  filterInput: React.CSSProperties;
  reorderFilterItem: React.CSSProperties;
  headerSeparator: React.CSSProperties;
  gridContainer: React.CSSProperties;
  gridContainerXScroll: React.CSSProperties;
  gridContainerYScroll: React.CSSProperties;
  grid: React.CSSProperties;
  gridItem: React.CSSProperties;
  reorderGridItem: React.CSSProperties;
  row: React.CSSProperties;
  expandableRow: React.CSSProperties;
  expandedRow: React.CSSProperties;
  noReorder: React.CSSProperties;
  paginator: Partial<PaginatorStyle>;
  resizeLine: React.CSSProperties;
  reorderColumn: React.CSSProperties;
  selected: React.CSSProperties;
  frozen: React.CSSProperties;
  selectedFrozen: React.CSSProperties;
  rowExtender: React.CSSProperties;
  contextMenu?: Partial<ContextMenuStyle>;
}

export const defaultGridViewStyle: GridViewStyle = {

  // try to avoid margins. It is very likely they will break the table at some point

  container: {
    // label: 'Container',
    flex: '1 1 auto',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    padding: '5px',
    overflow: 'hidden',
    fontSize: '16px', // defining a starting point for this.estimateColumnnWidths
  },

  tableWrapper: {
    // label: 'TableWrapper',
    display: 'flex',
    flex: '1 1 auto',
  },

  tableContainer: {
    // label: 'TableContainer',
    // flex is/has to be set via inline styles
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  headerContainer: {
    // label: 'HeaderContainer',
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
    boxSizing: 'border-box',
    overflow: 'hidden', // needed to align the header with a grid with scrollbar
    // hacky, but otherwise e.g. a filter drop down menu might get cut off, because of overflow hidden
    paddingBottom: '400px',
    marginBottom: '-400px',
  },

  preGridContainer: {
    // label: 'PreGridContainer',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },

  header: {
    // label: 'Header',
    display: 'flex',
    flex: '1 0 auto',
    color: '#777',
    fontWeight: 'bold',
  },

  headerItem: {
    // label: 'HeaderItem',
    display: 'flex',
    flex: '1 1 auto',
    border: '1px solid black',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },

  reorderHeaderItem: {
    // label: 'ReorderHeaderItem',
    display: 'flex',
    flex: '1 1 auto',
    boxSizing: 'border-box',
    padding: '1px',
  },

  headerElements: {
    // label: 'HeaderElement',
    display: 'flex',
    flex: '1 1 auto',
    padding: '4px',
    boxSizing: 'border-box',
    userSelect: 'none',
    cursor: 'default',
    whiteSpace: 'nowrap',
    minWidth: '0',
  },

  headerName: {
    // label: 'HeaderName',
    margin: '0 5px',
  },

  sortPrio: {
    // label: 'SortPrio',
    fontSize: '10px',
  },

  columnResizer: {
    // label: 'ColumnResizer',
    flex: '0 0 auto',
    height: 'auto',
    padding: '0px',
    cursor: 'col-resize',
    border: '2px solid transparent',
    zIndex: 5,
  },

  filter: {
    // label: 'Filter',
    display: 'flex',
    flex: '1 0 auto',
  },

  filterItem: {
    // label: 'FilterItem',
    display: 'flex',
    cursor: 'default',
    flex: '1 1 auto',
    border: '1px solid black',
    boxSizing: 'border-box',
    padding: '3px 5px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  reorderFilterItem: {
    // label: 'ReorderFilterItem',
    display: 'flex',
    cursor: 'default',
    flex: '1 1 auto',
    boxSizing: 'border-box',
    padding: '4px 6px',
  },

  filterInput: {
    // label: 'FilterInput',
    flex: '1 1 auto',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    color: '#00cccc',
    padding: '0px 3px',
    boxSizing: 'border-box',
    width: '100%',
  },

  filterInputWrapper: {
    // label: 'filterInputWrapper',
    flex: '1 1 auto',
    flexDirection: 'row',
    width: '0px',
  },

  headerSeparator: {
    // label: 'HeaderSeparator',
    display: 'flex',
    flex: '1 0 auto',
    marginBottom: '10px',
  },

  gridContainer: {
    // label: 'GridContainer',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
  },

  gridContainerXScroll: {
    overflowX: 'scroll',
  },

  gridContainerYScroll: {
    overflowY: 'scroll',
  },

  grid: {
    // label: 'Grid',
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'row',
    minWidth: 'fit-content',
  },

  gridItem: {
    // label: 'GridItem',
    display: 'flex',
    flex: '1 1 auto',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    padding: '4px',
    border: '1px solid black',
    minWidth: 'min-content',
  },

  reorderGridItem: {
    // label: 'ReorderGridItem',
    display: 'flex',
    flex: '1 1 auto',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    padding: '5px',
  },

  row: {
    // label: 'Row',
    display: 'flex',
    flex: '1 0 auto',
  },

  expandableRow: {
    // label: 'ExpandableRow',
    display: 'flex',
    flex: '1 1 auto',
    // ':nth-child(odd)': {
    //   backgroundColor: 'rgba(0, 0, 0, 0.1)',
    //   backgroundBlendMode: 'multiply',
    // },
  },

  expandedRow: {
    // label: 'ExpandedRow',
    display: 'flex',
    flex: '1 0 auto',
    boxSizing: 'border-box',
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    padding: '4px',
  },

  paginator: {
    pagination: {
      display: 'flex',
      alignSelf: 'center',
      flex: '0 0 auto',
      boxSizing: 'border-box',
      alignContent: 'center',
      justifyContent: 'center',
    },

    pageButton: {
      flex: '0 0 auto',
      fontSize: '.8em',
    },

    raisedButton: {
      button: {
        padding: '8px 18px',
        margin: '2px',
      },
      buttonDisabled: {
        margin: '5px',
      },
    },
  },

  resizeLine: {
    width: '1px',
    position: 'absolute',
    zIndex: 20,
    backgroundColor: '#777',
  },

  reorderColumn: {
    // label: 'ReorderColumn',
    position: 'absolute',
    backgroundColor: 'white',
    overflow: 'hidden',
    zIndex: 11,
  },

  noReorder: {
    backgroundColor: 'rgba(255, 51, 0, 0.1)',
  },

  selected: {
    backgroundImage: 'linear-gradient(0deg, rgba(150, 255, 100, 0.2), rgba(150, 255, 100, 0.3))',
  },

  frozen: {
    backgroundImage: 'linear-gradient(0deg, rgba(50, 100, 255, 0.2), rgba(50, 100, 255, 0.3))',
  },

  selectedFrozen: {
    backgroundImage: 'linear-gradient(0deg, rgba(0, 255, 200, 0.2), rgba(0, 255, 200, 0.2))',
  },

  rowExtender: {
    // label: 'RowExtender',
    display: 'block',
    minWidth: '25px',
    padding: '4px',
    border: '1px solid black',
  },
};


export interface SortFunc<T> {
  (a: T, b: T): number;
}

export interface ColumnDefinition {
  key: (item: any) => any;
  title?: string;
  style?: React.CSSProperties;
  notSortable?: boolean;
  noReordering?: boolean;
  sortKey?: (item: any) => any;
  // viewPermission?: string;
  // editPermission?: string;
  sortFunction?: SortFunc<any>; // no longer functional, can be removed after ColumnDefinition cleanup
  renderItem?: (item: any, columnIndex: number, renderData?: { [id: string]: any }) => JSX.Element;
  headerTemplate?: any;
  customFilterElement?: any;
}

export interface ExtendedColumnDef extends ColumnDefinition {
  columnIndex?: number;
}

export interface ClickOrigin {
  columnIndex: number;
  object?: string;
  rowID?: string;
  targetElement?: EventTarget;
}

export enum GridViewSort {
  None,
  Up,
  Down,
}

export interface SortInfo {
  index: number;
  sorted: GridViewSort;
}

export enum ColumnGroupType {
  Frozen,
  Scrollable,
  Dummy,
}

interface Reordering {
  columnIndex: number;
  leftBorder: number;
  rightBorder: number;
  leftTrigger: number;
  rightTrigger: number;
  leftScrollTrigger: number;
  rightScrollTrigger: number;
  columnPosition: number;
  mousePosition: number;
}

export interface GridViewConnectedProps {
  inputData: any;
  columnDefs: ExtendedColumnDef[];
  frozenColumns: number[];
  scrollableColumns: number[];
  frozenColumnDefs: ExtendedColumnDef[];
  scrollableColumnDefs: ExtendedColumnDef[];
  reorderColumnDef: ExtendedColumnDef[];

  classNameObject: GridViewClassNames;

  // data
  outputItems: any[];

  // userPermissions: ql.PermissionInfo[];

  resizeableColumns: boolean;
  fixedTableWidth: boolean;
  reorderableColumns: boolean;
  allowXScrollbar: boolean;
  allowYScrollbar: boolean;
  scrollbarWidth: number;

  // state
  columnStyles: React.CSSProperties[];
  xScrollbarVisible: boolean;
  yScrollbarVisible: boolean;
  contextMenuVisible: boolean;
  columnReordering: boolean;

  needRowExpansionHeight: boolean;
  needScrollContainerDimensions: boolean;
  visible: boolean;
}

export interface GridViewProps extends GridViewConnectedProps {
  dispatch: (action: any) => void;
}

const select = (state: Reducer.GridViewState): GridViewConnectedProps => {
  return {
    inputData: Reducer.getInput(state),
    columnDefs: Reducer.getColumnDefs(state),
    frozenColumns: Reducer.getFrozenColumns(state),
    scrollableColumns: Reducer.getScrollableColumns(state),
    frozenColumnDefs: Reducer.getFrozenColumnDefs(state),
    scrollableColumnDefs: Reducer.getVirtualColumnDefs(state),
    reorderColumnDef: Reducer.getReorderColumnDef(state),
    classNameObject: Reducer.getGridClassnames(state),
    outputItems: Reducer.getOutputIDs(state),
    resizeableColumns: Reducer.getResizeableColumns(state),
    fixedTableWidth: Reducer.getFixedTableWidth(state),
    reorderableColumns: Reducer.getReorderableColumns(state),
    allowXScrollbar: Reducer.getAllowXScrollbar(state),
    allowYScrollbar: Reducer.getAllowYScrollbar(state),
    columnStyles: Reducer.getColumnStyles(state),
    xScrollbarVisible: Reducer.getXScrollbarVisible(state),
    yScrollbarVisible: Reducer.getYScrollbarVisible(state),
    contextMenuVisible: Reducer.getContextMenuVisible(state),
    columnReordering: Reducer.getColumnReordering(state),
    needRowExpansionHeight: Reducer.getNeedRowExpansionHeight(state),
    needScrollContainerDimensions: Reducer.getNeedScrollContainerDimensions(state),
    scrollbarWidth: Reducer.getScrollbarWidth(state),
    visible: Reducer.getVisible(state),
  };
};

export class GridViewImpl<P extends Partial<GridViewProps>, S> extends React.Component<P, S> {
  private containerRef: HTMLDivElement = null;
  private tableWrapperRef: HTMLDivElement = null;
  private columnRefs: HTMLDivElement[] = [];
  private resizeLine: HTMLElement = null;
  private columnResizing: boolean = false;
  private resizeColumnIndex: number = -1;
  private resizeLineStartX: number = 0;
  private containerLeft: number = 0;
  private gridContainerRef: HTMLDivElement = null;
  private reorderColumnRef: HTMLDivElement = null;
  private mouseMoveStartX: number = 0;
  private reordering: Reordering = {
    columnIndex: 0,
    leftBorder: 0,
    leftTrigger: 0,
    rightTrigger: 0,
    rightBorder: 0,
    leftScrollTrigger: 0,
    rightScrollTrigger: 0,
    columnPosition: 0,
    mousePosition: 0,
  };

  constructor(props: P) {
    super(props);
    this.calcScrollbarWidth();
  }

  public render() {
    // console.log('rendering GridViewMain');
    if (!this.props.visible) return null;

    const resizeIndicator = (this.props.resizeableColumns) && (
      <div
        ref={r => this.resizeLine = r}
        className={this.props.classNameObject.resizeLine}
        style={{ display: 'none' }}>
      </div>
    );

    const dummyColumnIsScrollable = this.props.scrollableColumns.indexOf(this.reordering.columnIndex) !== -1;
    const reorderColumn = (
      this.props.reorderableColumns
      && this.props.columnReordering
      && this.props.reorderColumnDef[0])
      && (
      <div
        className={this.props.classNameObject.reorderColumn}
        ref={r => this.reorderColumnRef = r}
      >
        <ColumnGroup
          columnGroupType={ColumnGroupType.Dummy}
          classNameObject={this.props.classNameObject}
          scrollable={dummyColumnIsScrollable}
          columnDefs={this.props.reorderColumnDef}
          xScrollbarVisible={this.props.xScrollbarVisible}
          yScrollbarVisible={this.props.yScrollbarVisible}
          onScroll={this.onScroll}
          handleMouseDownColumnResizer={this.handleMouseDownColumnResizer}
          handleMouseDownColumnHeader={this.handleMouseDownColumnHeader}
          columnRefs={this.getColumnRefs}
          gridContainerRef={null}
          hasOutput={this.props.outputItems && this.props.outputItems.length ? true : false}
        />
      </div>
    );

    return (
      <div className={this.props.classNameObject.container} ref={r => this.containerRef = r}>
        <div className={this.props.classNameObject.tableWrapper} ref={r => this.tableWrapperRef = r}>
          {this.props.frozenColumnDefs.length > 0 && <ColumnGroup
            columnGroupType={ColumnGroupType.Frozen}
            classNameObject={this.props.classNameObject}
            scrollable={false}
            columnDefs={this.props.frozenColumnDefs}
            xScrollbarVisible={this.props.xScrollbarVisible}
            yScrollbarVisible={this.props.yScrollbarVisible}
            onScroll={this.onScroll}
            handleMouseDownColumnResizer={this.handleMouseDownColumnResizer}
            handleMouseDownColumnHeader={this.handleMouseDownColumnHeader}
            columnRefs={this.getColumnRefs}
            gridContainerRef={null}
            hasOutput={this.props.outputItems && this.props.outputItems.length ? true : false}
            rowExpansionRef={this.props.needRowExpansionHeight ? this.getRowExpansionRef : null}
          />}
          <ColumnGroup
            columnGroupType={ColumnGroupType.Scrollable}
            classNameObject={this.props.classNameObject}
            scrollable={true}
            columnDefs={this.props.scrollableColumnDefs}
            xScrollbarVisible={this.props.xScrollbarVisible}
            yScrollbarVisible={this.props.yScrollbarVisible}
            onScroll={this.onScroll}
            handleMouseDownColumnResizer={this.handleMouseDownColumnResizer}
            handleMouseDownColumnHeader={this.handleMouseDownColumnHeader}
            columnRefs={this.getColumnRefs}
            gridContainerRef={this.getGridContainerRef}
            hasOutput={this.props.outputItems && this.props.outputItems.length ? true : false}
            rowExpansionRef={this.props.needRowExpansionHeight ? this.getRowExpansionRef : null}
          />
          {reorderColumn}
          {resizeIndicator}
          {this.props.contextMenuVisible && <ContextMenu
            exportData={this.exportData}
            exportTable={this.exportTable}
            classNameObject={this.props.classNameObject.contextMenu || {}}
          />}

        </div>
        <Paginator
          styles={this.props.classNameObject.paginator || {}}
        />
      </div>
    );
  }

  // public shouldComponentUpdate(nextProps: GridViewProps) {
  //   console.log('ColumnGroupUpdate');
  //   shallowDiffersWithLog(this.props, nextProps);
  //   return true;
  // }

  public componentDidMount() {
    window.addEventListener('resize', debounce(this.onTableResize, 200));
    this.checkScrollContainer();
  }

  public componentDidUpdate() {
    if (this.props.needScrollContainerDimensions) this.checkScrollContainer();
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', debounce(this.onTableResize, 200));
    this.unbindColumnResizeEvents();
    this.unbindColumnReorderEvents();
  }

  public checkScrollContainer = () => {
    const noData = this.props.inputData.constructor === Object && Object.keys(this.props.inputData).length === 0;
    if (this.gridContainerRef && !noData) {
      setTimeout(() => {
        const { width, height } = this.gridContainerRef.getBoundingClientRect();
        this.props.dispatch(Action.setScrollContainerDimensions(width, height));
      }, 0);
    }
  }

  public getGridContainerRef = (gridContainerRef: HTMLDivElement) => this.gridContainerRef = gridContainerRef;

  public getColumnRefs = (columnRef: HTMLDivElement, index: number) => {
    this.columnRefs[index] = columnRef;
  }

  public getRowExpansionRef = (expandedRowRef: HTMLDivElement) => {
    if (this.props.needRowExpansionHeight) {
      // console.log('measuring expanded Row');
      // console.log(expandedRowRef);
      this.props.dispatch(Action.setRowExpansionHeight(expandedRowRef.getBoundingClientRect().height));
    }
  }

  public onTableResize = () => {
    // TODO: need a trigger for this function, if a resize is done via HUDDrag or use this.props.changedContainerDimensions
    // this.props.dispatch(Action.setRowExpansionHeight(0));
    // this.props.dispatch(Action.setRowHeight(0));
    // this.props.dispatch(Action.setScrollContainerDimensions(0, 0));
    this.checkScrollContainer();
  }


  private handleMouseDownColumnResizer = (
    event: React.MouseEvent<HTMLDivElement>,
    columnIndex: number,
  ) => {
    console.log('handle');
    if (this.props.resizeableColumns) {
      this.onColumnResizeBegin(
        event,
        columnIndex,
      );
    }
  }

  private handleMouseDownColumnHeader = (
    event: React.MouseEvent<HTMLDivElement>,
    columnIndex: number,
  ) => {
    if (event.button === 0) {
      if (this.props.reorderableColumns) {
        this.onColumnReorderBegin(
          event,
          columnIndex,
        );
      }
    }
  }

  /*
   * RESIZING
   */

  private onColumnResizeBegin = (event: React.MouseEvent<HTMLDivElement>, columnIndex: number) => {
    this.resizeColumnIndex = columnIndex;
    this.columnResizing = true;
    const containerRect = this.containerRef.getBoundingClientRect();
    this.containerLeft = containerRect.left;
    this.resizeLineStartX = event.pageX - containerRect.left;
    this.resizeLine.style.height = containerRect.height + 'px';
    this.resizeLine.style.top = this.tableWrapperRef.offsetTop + 'px';
    this.resizeLine.style.left = this.resizeLineStartX + 'px';
    this.resizeLine.style.display = 'block';
    this.containerRef.style.userSelect = 'none';
    this.bindColumnResizeEvents();
  }

  private onColumnResize = (event: MouseEvent) => {
    this.resizeLine.style.left = (event.pageX - this.containerLeft) + 'px';
  }

  private bindColumnResizeEvents = () => {
    window.addEventListener('mousemove', this.onColumnResize);
    window.addEventListener('mouseup', this.onColumnResizeDone);
  }

  private unbindColumnResizeEvents = () => {
    window.removeEventListener('mousemove', this.onColumnResize);
    window.removeEventListener('mouseup', this.onColumnResizeDone);
  }

  private onColumnResizeDone = (event: MouseEvent) => {
    this.columnResizing = false;
    let sizeChange = this.resizeLine.offsetLeft - this.resizeLineStartX;
    const resizeColumn = this.columnRefs[this.resizeColumnIndex];
    const resizeColumnWidth = resizeColumn.getBoundingClientRect().width;
    let nextColumnWidth = resizeColumnWidth + sizeChange;
    let nextColumnStyles: React.CSSProperties[] = [];
    /* no scrollbar means the sum of all minWidths is smaller than the available space. If the sizeChange is negativ,
       the overall minWidth will become even smaller. More space will become available, which gets distributed amongst
       all columns because of the flexboxes. This would result in changes to all columns, that seem to be random.
       To prevent this, I am treating this situation, like I had a fixed table width.
    */
    if (this.props.fixedTableWidth || !this.props.xScrollbarVisible && sizeChange < 0) {
      const columnOrder = [...this.props.frozenColumns, ...this.props.scrollableColumns];
      const lastColumnIndex = columnOrder[columnOrder.length - 1];
      // if we are not handling a resize on the last column, we proceed. Otherwise no resize is done,
      // because this would cause "random" changes to the column widths
      if (lastColumnIndex !== this.resizeColumnIndex) {
        // const columnWidths = this.columnRefs.map(ref => ref.getBoundingClientRect().width);
        const neighborColumnIndex = this.getNeighborColumnIndex(columnOrder, this.resizeColumnIndex);
        let nextNeighborColumnWidth = this.columnRefs[neighborColumnIndex].getBoundingClientRect().width - sizeChange;
        const addedWidth = nextColumnWidth + nextNeighborColumnWidth;
        if (sizeChange > 0) {
          if (nextNeighborColumnWidth < 15) {
            nextNeighborColumnWidth = 15;
            nextColumnWidth = addedWidth - nextNeighborColumnWidth;
          }
        } else {
          if (nextColumnWidth < 15) {
            nextColumnWidth = 15;
            nextNeighborColumnWidth = addedWidth - nextColumnWidth;
          }
        }
        nextColumnStyles = this.props.columnStyles.map((columnStyle, index) => {
          if (index === this.resizeColumnIndex) {
            return { ...columnStyle, width: nextColumnWidth, minWidth: nextColumnWidth };
          }
          if (index === neighborColumnIndex) {
            return { ...columnStyle, width: nextNeighborColumnWidth, minWidth: nextNeighborColumnWidth };
          }
          if (this.columnRefs[index]) {
            const columnWidth = this.columnRefs[index].getBoundingClientRect().width;
            return { ...columnStyle, width: columnWidth, minWidth: columnWidth };
          }
          return columnStyle;
        });
      } else {
        nextColumnStyles = this.props.columnStyles;
      }
    } else {
      if (sizeChange < 0) {
        if (nextColumnWidth < 15) {
          nextColumnWidth = 15;
          sizeChange = nextColumnWidth - resizeColumnWidth;
        }
      }

      if (this.props.xScrollbarVisible) {
        nextColumnStyles = this.props.columnStyles.map((columnStyle, index) => {
          if (index === this.resizeColumnIndex) {
            return {
              ...columnStyle,
              width: nextColumnWidth,
              minWidth: nextColumnWidth,
            };
          }
          return columnStyle;
        });
      } else {
        const columnWidths = this.columnRefs.map(ref => ref.getBoundingClientRect().width);
        nextColumnStyles = columnWidths.map((width, index) => {
          if (index === this.resizeColumnIndex) {
            return {
              width: nextColumnWidth,
              minWidth: nextColumnWidth,
            };
          }
          return {
            width,
            minWidth: width,
          };
        });
      }
    }
    this.props.dispatch(Action.importColumnStyles(nextColumnStyles));
    this.resizeLine.style.display = 'none';
    this.containerRef.style.userSelect = 'auto';
    this.unbindColumnResizeEvents();
  }

  private getNeighborColumnIndex = (columnOrder: number[], columnIndex: number): number => {
    const resizeColumnPosition = columnOrder.indexOf(columnIndex);
    return columnOrder[resizeColumnPosition + 1];
  }

  private onScroll = (yScrollPosition: number) => {
    const nextYScrollPosition = this.gridContainerRef.scrollTop;
    if (nextYScrollPosition !== yScrollPosition) {
      window.requestAnimationFrame(() => this.props.dispatch(Action.setYScrollPosition(nextYScrollPosition)));
    } else {
      const nextXScrollPosition = this.gridContainerRef.scrollLeft;
      window.requestAnimationFrame(() => this.props.dispatch(Action.setXScrollPosition(nextXScrollPosition)));
    }
  }

  /*
    COLUMN REORDERING
  */

  private onColumnReorderBegin = (event: React.MouseEvent<HTMLDivElement>, columnIndex: number) => {
    // no reordering, if we are already resizing, otherwise we would do both at the same time
    if (!this.columnResizing && this.props.reorderableColumns) {
      // expanded Rows will mess up our layout so we close them, if reordering starts
      this.props.dispatch(Action.setExpandedRowIDs([]));
      this.containerRef.style.userSelect = 'none';
      const { left, width } = this.columnRefs[columnIndex].getBoundingClientRect();
      // console.log(left + ' : ' + width);
      const top = this.columnRefs[columnIndex].offsetTop;
      const ro = this.reordering;
      ro.mousePosition = event.pageX;
      // no switching between frozen and scrollable columns. To prevent this, the column can only be moved
      // within the borders of its own kind and within the table
      if (!this.props.xScrollbarVisible) {
        if (this.props.frozenColumns.indexOf(columnIndex) !== -1) {
          this.prepareReorder(this.props.frozenColumns, columnIndex, left, width, event.pageX, 0);
        } else {
          this.prepareReorder(this.props.scrollableColumns, columnIndex, left, width, event.pageX, 0);
        }
      } else {
        const scrollLeft = this.gridContainerRef.scrollLeft;
        if (this.props.frozenColumns.indexOf(columnIndex) !== -1) {
          this.prepareReorder(
            this.props.frozenColumns,
            columnIndex,
            left,
            width,
            event.pageX,
            scrollLeft,
          );
        } else {
          this.prepareReorder(
            this.props.scrollableColumns,
            columnIndex,
            left,
            width,
            event.pageX,
            scrollLeft,
          );
        }
      }
      ro.columnIndex = columnIndex;
      this.props.dispatch(Action.setReorderColumn(columnIndex));
      this.props.dispatch(Action.columnReordering(true));

      // prevent, that the reordering column is overlapping an existing x scrollbar
      const columnHeight = this.props.xScrollbarVisible
        ? this.tableWrapperRef.getBoundingClientRect().height - this.props.scrollbarWidth
        : this.tableWrapperRef.getBoundingClientRect().height;

      this.placeColumn(this.reorderColumnRef, top, left, width, columnHeight);

      // calculate the scroll triggers, if we need them
      const isScrollableColumn = this.props.scrollableColumns.indexOf(columnIndex) !== -1;
      if (this.props.xScrollbarVisible && isScrollableColumn) {
        ro.leftScrollTrigger = this.gridContainerRef.getBoundingClientRect().left;
        // prevent, that an y scrollbar is overlapped by the reordering column
        ro.rightScrollTrigger = this.props.yScrollbarVisible
          ? this.gridContainerRef.getBoundingClientRect().right - width - this.props.scrollbarWidth
          : this.gridContainerRef.getBoundingClientRect().right - width;
      }

      this.bindColumnReorderEvents();
    }
  }

  private prepareReorder = (
    columns: number[],
    columnIndex: number,
    columnRectLeft: number,
    columnRectWidth: number,
    eventX: number,
    scrollLeft: number,
  ) => {
    this.mouseMoveStartX = eventX + scrollLeft;
    this.reordering.columnPosition = columnRectLeft + scrollLeft;
    // console.log('lastColumnLeft: ' + this.columnRefs[columns[0]].getBoundingClientRect().left);
    // console.log(this.gridContainerRef.getBoundingClientRect().left);
    const isScrollableColumn = this.props.scrollableColumns.indexOf(columnIndex) !== -1;
    const leftBorder = isScrollableColumn
      ? this.gridContainerRef.getBoundingClientRect().left
      : this.columnRefs[columns[0]].getBoundingClientRect().left + scrollLeft;
    // console.log(leftBorder);
    const lastColumnRight = isScrollableColumn
      ? this.gridContainerRef.firstChild.firstChild.parentElement.getBoundingClientRect().right
      : this.columnRefs[columns[columns.length - 1]].getBoundingClientRect().right;
    // console.log('lastColumnRight: ' + lastColumnRight);

    const rightBorder = lastColumnRight - columnRectWidth + scrollLeft;
    this.reordering.leftBorder = leftBorder;
    this.reordering.rightBorder = rightBorder;
    this.reorderTriggerCalc(columns, columnIndex, columnRectLeft, leftBorder, rightBorder, scrollLeft);
  }

  private placeColumn = (columnRef: HTMLDivElement, top: number, left: number, width: number, height: number) => {
    columnRef.style.left = left + 'px';
    columnRef.style.top = top + 'px';
    columnRef.style.width = width + 'px';
    columnRef.style.height = height + 'px';
  }

  private reorderTriggerCalc = (
    columns: number[],
    columnIndex: number,
    columnRectLeft: number,
    leftBorder: number,
    rightBorder: number,
    scrollPosition: number,
  ) => {
    // setting both reorder triggers to an unreachable position, so we they don't trigger accidently
    let leftTrigger = leftBorder - 2;
    let rightTrigger = rightBorder + 2;

    const orderIndex = columns.indexOf(columnIndex);

    // check, if we need a reorder trigger, and calcualte it
    // search for a column to the left, that is reorderable
    const { reorderableColumnLeft, distLeft } = this.getReorderableColumnLeft(columns, orderIndex);
    // console.log(orderIndex);
    // console.log(reorderableColumnLeft);
    // check if there is a column to the left
    if (orderIndex >= reorderableColumnLeft) {
      if (this.props.xScrollbarVisible && this.props.scrollableColumns.indexOf(this.reordering.columnIndex) !== -1) {
        leftTrigger = columnRectLeft - distLeft;
      } else {
        const relevantColumns = columns.slice(0, orderIndex - reorderableColumnLeft);
        // console.log('columns: ' + columns);
        // console.log(relevantColumns);
        const triggerColumnPos = relevantColumns.reduce((position: number, columnIndex: number) => {
          return position + this.columnRefs[columnIndex].getBoundingClientRect().width;
        }, 0);
        // console.log('triggerColumnPos: ' + triggerColumnPos);
        // console.log('LeftBorder: ' + this.reordering.leftBorder);
        // console.log('Left-RO-Width: '
        //    + (this.columnRefs[columns[orderIndex - reorderableColumnLeft]].getBoundingClientRect().width / 2));
        leftTrigger = triggerColumnPos
          + this.columnRefs[columns[orderIndex - reorderableColumnLeft]].getBoundingClientRect().width / 2
          + this.reordering.leftBorder
          - scrollPosition;
        // console.log('leftTrigger: ' + leftTrigger);
      }
      // console.log('leftTrigger2: ' + (columnRectLeft - distLeft));
    }

    const { reorderableColumnRight, distRight } = this.getReorderableColumnRight(columns, orderIndex);
    // console.log(reorderableColumnRight);
    if (orderIndex + reorderableColumnRight < columns.length) {
      if (this.props.xScrollbarVisible && this.props.scrollableColumns.indexOf(this.reordering.columnIndex) !== -1) {
        rightTrigger = columnRectLeft + distRight;
      } else {
        const relevantColumns = columns.slice(0, orderIndex + reorderableColumnRight);
        // console.log('columns: ' + columns);
        // console.log(relevantColumns);
        const triggerColumnPos = relevantColumns.reduce((position: number, columnIndex: number) => {
          return position + this.columnRefs[columnIndex].getBoundingClientRect().width;
        }, 0);
        // console.log('triggerColumnPos: ' + triggerColumnPos);
        // console.log(
        //   ' Right-RO-Width: '
        //   + (this.columnRefs[columns[orderIndex + reorderableColumnRight]].getBoundingClientRect().width / 2));
        // console.log('LeftBorder: ' + this.reordering.leftBorder);
        // console.log('ro-columnWidth: ' + this.columnRefs[columns[orderIndex]].getBoundingClientRect().width)
        // console.log('scrollPosition: ' + scrollPosition);
        rightTrigger = triggerColumnPos
          + this.columnRefs[columns[orderIndex + reorderableColumnRight]].getBoundingClientRect().width / 2
          + this.reordering.leftBorder
          - this.columnRefs[columns[orderIndex]].getBoundingClientRect().width
          - scrollPosition;
        // console.log('rightTrigger: ' + rightTrigger);
      }
      // console.log('rightTrigger2: ' + (columnRectLeft + distRight));
    }
    this.reordering.leftTrigger = leftTrigger;
    this.reordering.rightTrigger = rightTrigger;
  }

  private getReorderableColumnLeft = (
    columns: number[],
    orderIndex: number,
  ): { reorderableColumnLeft: number, distLeft: number } => {
    let reorderableColumnLeft: number;
    let distLeft: number = 0;
    for (reorderableColumnLeft = 1; reorderableColumnLeft <= orderIndex; reorderableColumnLeft++) {
      if (!this.props.columnDefs[columns[orderIndex - reorderableColumnLeft]].noReordering) break;
      distLeft += this.props.columnStyles[columns[orderIndex - reorderableColumnLeft]].minWidth as number;
    }
    if (orderIndex >= reorderableColumnLeft) {
      distLeft += (this.props.columnStyles[columns[orderIndex - reorderableColumnLeft]].minWidth as number) / 2;
    }
    // console.log('distLeft: ' + distLeft);
    return ({
      reorderableColumnLeft,
      distLeft,
    });
  }

  private getReorderableColumnRight = (
    columns: number[],
    orderIndex: number,
  ): { reorderableColumnRight: number, distRight: number } => {
    const max = columns.length - orderIndex;
    let reorderableColumnRight: number;
    let distRight: number = 0;
    for (reorderableColumnRight = 1; reorderableColumnRight < max; reorderableColumnRight++) {
      if (!this.props.columnDefs[columns[orderIndex + reorderableColumnRight]].noReordering) break;
      distRight += this.props.columnStyles[columns[orderIndex + reorderableColumnRight]].minWidth as number;
    }
    if (orderIndex + 1 < columns.length) {
      distRight += (this.props.columnStyles[columns[orderIndex + reorderableColumnRight]].minWidth as number) / 2;
    }
    // console.log('distRight: ' + distRight);
    return ({
      reorderableColumnRight,
      distRight,
    });
  }

  private onColumnReorder = (event: MouseEvent) => {
    const ro = this.reordering;
    const scrollStep = 150;
    let columnPositionLeft = ro.columnPosition + event.pageX - this.mouseMoveStartX;

    // prevent, that the column passes its borders
    // simple borders, if we are reordering frozenColumns , that will always be at the same position,
    // or if there is no x scrollbar
    const isFrozenColumn = this.props.frozenColumns.indexOf(ro.columnIndex) !== -1;
    if (!this.props.xScrollbarVisible || isFrozenColumn) {
      if (columnPositionLeft < ro.leftBorder) columnPositionLeft = ro.leftBorder;
      if (columnPositionLeft > ro.rightBorder) columnPositionLeft = ro.rightBorder;
    } else {
      let desiredScroll = 0;
      // trigger scrolling, if we hit the borders of our scrolling/grid container
      if (columnPositionLeft <= ro.leftScrollTrigger) {
        columnPositionLeft = ro.leftScrollTrigger;
        if (event.pageX <= ro.mousePosition) {
          desiredScroll = -scrollStep;
        }
      }
      if (columnPositionLeft >= ro.rightScrollTrigger) {
        columnPositionLeft = ro.rightScrollTrigger;
        // only scroll, if the mouse moved in the scroll direction
        // (otherwise we might move the mouse in on direction and scroll in another)
        if (event.pageX >= ro.mousePosition) {
          desiredScroll = scrollStep;
        }
      }
      if (desiredScroll !== 0) {
        const currentScrollPosition = this.gridContainerRef.scrollLeft;
        this.gridContainerRef.scrollLeft += desiredScroll;
        const newScrollPosition = this.gridContainerRef.scrollLeft;
        const actualScroll = newScrollPosition - currentScrollPosition;
        if (actualScroll !== 0) {
          // console.log('actualScroll: ' + actualScroll);
          ro.leftTrigger -= actualScroll;
          ro.rightTrigger -= actualScroll;
        }
      }
    }

    // if we are reordering a scrolling column we need to take the scroll position into account,
    // otherwise it is 0 and has no effect
    const scrollPosition = !this.props.xScrollbarVisible && isFrozenColumn ? 0 : this.gridContainerRef.scrollLeft;

    // console.log('columnPositionLeft: ' + columnPositionLeft);
    // console.log('trigger: ' + ro.leftTrigger + ' : ' + ro.rightTrigger);
    if (columnPositionLeft < ro.leftTrigger - 2) {
      const columns = isFrozenColumn ? this.props.frozenColumns : this.props.scrollableColumns;
      const orderIndex = columns.indexOf(ro.columnIndex);

      // if the orderIndex is not > 0 there is no column left to switch with
      if (orderIndex > 0) {
        const { reorderableColumnLeft } = this.getReorderableColumnLeft(columns, orderIndex);
        const nextColumnOrder = [
          ...columns.slice(0, orderIndex - reorderableColumnLeft),
          ro.columnIndex,
          ...columns.slice(orderIndex - reorderableColumnLeft + 1, orderIndex),
          columns[orderIndex - reorderableColumnLeft],
          ...columns.slice(orderIndex + 1),
        ];

        ro.rightTrigger = ro.leftTrigger;
        // console.log(ro.rightTrigger);

        const currentColumnPosition = this.props.xScrollbarVisible && !isFrozenColumn
          ? ro.leftTrigger - (this.props.columnStyles[columns[orderIndex - reorderableColumnLeft]].minWidth as number) / 2
          : this.columnRefs[columns[orderIndex - reorderableColumnLeft]].getBoundingClientRect().left;
        // console.log(ro.columnPosition);
        // console.log('currentColumnPosition: ' + currentColumnPosition);
        this.reorderTriggerCalc(
          nextColumnOrder,
          ro.columnIndex,
          currentColumnPosition,
          ro.leftBorder,
          ro.rightBorder,
          scrollPosition,
        );
        if (isFrozenColumn) {
          this.props.dispatch(Action.setFrozenColumns(nextColumnOrder));
        } else {
          this.props.dispatch(Action.setScrollableColumns(nextColumnOrder));
        }
      }
    }

    if (columnPositionLeft > ro.rightTrigger + 2) {
      const columns = isFrozenColumn ? this.props.frozenColumns : this.props.scrollableColumns;
      const orderIndex = columns.indexOf(ro.columnIndex);

      // if it is already the last column there is nothing left to change position with
      if (orderIndex + 1 < columns.length) {
        const { reorderableColumnRight } = this.getReorderableColumnRight(columns, orderIndex);
        const nextColumnOrder = [
          ...columns.slice(0, orderIndex),
          columns[orderIndex + reorderableColumnRight],
          ...columns.slice(orderIndex + 1, orderIndex + reorderableColumnRight),
          ro.columnIndex,
          ...columns.slice(orderIndex + reorderableColumnRight + 1),
        ];
        ro.leftTrigger = ro.rightTrigger;
        // console.log(ro.leftTrigger);

        const currentColumnPosition = this.props.xScrollbarVisible && !isFrozenColumn
          ? ro.rightTrigger + (this.props.columnStyles[columns[orderIndex + reorderableColumnRight]].minWidth as number) / 2
          : ro.rightTrigger
            + this.columnRefs[columns[orderIndex + reorderableColumnRight]].getBoundingClientRect().width / 2;
        // console.log('currentColumnPosition: ' + currentColumnPosition);
        this.reorderTriggerCalc(
          nextColumnOrder,
          ro.columnIndex,
          currentColumnPosition,
          ro.leftBorder,
          ro.rightBorder,
          scrollPosition,
        );

        if (isFrozenColumn) {
          this.props.dispatch(Action.setFrozenColumns(nextColumnOrder));
        } else {
          this.props.dispatch(Action.setScrollableColumns(nextColumnOrder));
        }
      }
    }

    ro.mousePosition = event.pageX;
    this.reorderColumnRef.style.left = columnPositionLeft + 'px';
  }

  private bindColumnReorderEvents = () => {
    window.addEventListener('mousemove', this.onColumnReorder);
    window.addEventListener('mouseup', this.onColumnReorderDone);
  }

  private onColumnReorderDone = () => {
    this.props.dispatch(Action.columnReordering(false));
    this.containerRef.style.userSelect = 'auto';
    this.unbindColumnReorderEvents();
  }

  private unbindColumnReorderEvents = () => {
    window.removeEventListener('mousemove', this.onColumnReorder);
    window.removeEventListener('mouseup', this.onColumnReorderDone);
  }

  private calcScrollbarWidth = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.className = css`
      width: 100px;
      height: 100px;
      overflow: scroll;
      position: absolute;
      top: -1000px;
    `;
    let scrollbarWidth = 0;
    if (this.tableWrapperRef) {
      this.tableWrapperRef.appendChild(scrollDiv);
      scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      this.tableWrapperRef.removeChild(scrollDiv);
    }
    if (scrollbarWidth) {
      this.props.dispatch(Action.setScrollbarWidth(scrollbarWidth));
    } else {
      setTimeout(() => this.calcScrollbarWidth(), 100);
    }
  }

  private exportTable = () => {
    let csv = '\ufeff';

    // Header
    this.props.columnDefs.forEach((def, index) => {
      csv += '"' + def.title + '"';
      if (index < this.props.columnDefs.length - 1) {
        csv += ';';
      }
    });

    // Data
    const data = this.props.inputData;
    Object.keys(data).forEach((key) => {
      csv += '\n';
      this.props.columnDefs.forEach((def, index) => {
        csv += '"' + def.key(data[key]) + '"';
        if (index < this.props.columnDefs.length - 1) {
          csv += ';';
        }
      });
    });

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, 'test123' + '.csv');
    } else {
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', 'test123' + '.csv');
        link.click();
      } else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }
      document.body.removeChild(link);
    }
  }

  private exportData = () => {
    let csv = '\ufeff';

    // Header
    for (const key in this.props.inputData[0]) {
      csv += '"' + key + '";';
    }

    // Data
    const data = this.props.inputData;
    Object.keys(data).forEach((dataKey) => {
      csv += '\n';
      const item = data[dataKey];
      for (const key in item) {
        csv += '"' + item[key] + '";';
      }
    });

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, 'Data123' + '.csv');
    } else {
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', 'Data123' + '.csv');
        link.click();
      } else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }
      document.body.removeChild(link);
    }
  }
}

export class GridView extends GridViewImpl<GridViewProps, {}> {
}

export default connect(select)(GridViewImpl);
