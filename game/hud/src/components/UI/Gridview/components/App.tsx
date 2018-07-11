/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Store }from 'redux';
import { isEqual } from 'lodash';
import * as Action from '../reducer/actions';
import GridViewMain, {
  GridViewStyle, ColumnGroupType, SortInfo, ColumnDefinition,
} from './GridViewMain';
import { SettingState } from '../reducer/settings';
import { AlterContextMenu, ContextMenuItem } from './index';
import { GridViewState } from '../reducer/reducer';


export interface AppProps {
  columnDefs: ColumnDefinition[];
  visible: boolean;
  inputData?: any;
  frozenColumns?: number[];
  hiddenColumns?: number[];
  renderData?: {[id: string]: any};
  rowExpansionTemplate?: (items: any, columnGroupType: ColumnGroupType) => JSX.Element;
  styles?: Partial<GridViewStyle>;
  frozenRowIDs?: string[];
  globalFilter?: string;
  filterArray?: string[]; // filterArray.length needs to be the same as columnDefinition.length. Use '' for empty filter
  multiSort?: SortInfo[];
  // userPermissions?: ql.PermissionInfo[];
  alterContextMenu?: (contextMenuInfo: AlterContextMenu) => ContextMenuItem[];
  rowIDKey?: (item: any) => any;
  showMultiFilters?: boolean;
  resizeableColumns?: boolean;
  fixedTableWidth?: boolean;
  reorderableColumns?: boolean;
  allowXScrollbar?: boolean;
  allowYScrollbar?: boolean;
  calculateItemsPerPage?: boolean;
  selectableRows?: boolean;
  allowExport?: boolean;
  allowVirtualYScrolling?: boolean;
  /* if the space available for the table has changed, but this was not caused by resizing the window, GridView does not know
  about this change and we have to inform it by setting changedContainerDimensions to true. Otherwise the number of items
  per page possible (needed for y- scrollbar and if you calculate the itemsPerPage) and the width available for
  x-scrolling are not recalculated, which means the scrollbars won't work correctly or we get an hidden overflow*/
  changedContainerDimensions?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  selectedRowIDs?: string[];
  expandedRowIDs?: string[];
  getStore?: (store: Store<GridViewState>) => void;
  dispatch?: (action: any) => void;
}


class App extends React.Component<AppProps, {}> {

  constructor(props: AppProps) {
    super(props);
    props.dispatch(Action.importColumnDefs(props.columnDefs));
    props.dispatch(Action.setVisible(props.visible));
    if (props) props.dispatch(Action.importSettings(settings(props)));
    if (props.inputData) props.dispatch(Action.importData(props.inputData, props.rowIDKey));
    if (props.styles) props.dispatch(Action.importGridViewStyle(props.styles));

    if (props.filterArray) {
      if (props.columnDefs) {
        const filterArray = props.filterArray.length === props.columnDefs.length
          ? props.filterArray
          : props.columnDefs.map(def => '');
        props.dispatch(Action.setMultiFilter(filterArray));
      } else {
        props.dispatch(Action.setMultiFilter(props.filterArray));
      }
    }

    if (props.multiSort) props.dispatch(Action.setMultiSort(props.multiSort));
    if (props.frozenRowIDs) props.dispatch(Action.setFrozenRowIDs(props.frozenRowIDs));
    if (props.globalFilter) props.dispatch(Action.setGlobalFilter(props.globalFilter));
    if (props.itemsPerPage) props.dispatch(Action.setItemsPerPage(props.itemsPerPage));
    if (props.frozenColumns) props.dispatch(Action.setFrozenColumns(props.frozenColumns));
    if (props.hiddenColumns) props.dispatch(Action.setHiddenColumns(props.hiddenColumns));

    if (props.currentPage) props.dispatch(Action.setCurrentPage(props.currentPage));
    if (props.selectedRowIDs) props.dispatch(Action.setSelectedRowIDs(props.selectedRowIDs));
    if (props.expandedRowIDs) props.dispatch(Action.setExpandedRowIDs(props.expandedRowIDs));
  }

  public render() {
    return (
      <GridViewMain/>
    );
  }

  public componentWillReceiveProps(nextProps: AppProps) {
    const props = this.props;
    if (props.visible !== nextProps.visible) props.dispatch(Action.setVisible(nextProps.visible));
    if (!isEqual(props.inputData, nextProps.inputData)) {
      props.dispatch(Action.importData(nextProps.inputData, nextProps.rowIDKey));
    }
    if (!isEqual(nextProps.filterArray, props.filterArray)) props.dispatch(Action.setMultiFilter(nextProps.filterArray));
    if (!isEqual(nextProps.multiSort, props.multiSort)) props.dispatch(Action.setMultiSort(nextProps.multiSort));
    if (!isEqual(nextProps.frozenRowIDs, props.frozenRowIDs)) props.dispatch(Action.setFrozenRowIDs(nextProps.frozenRowIDs));
    if (nextProps.globalFilter !== props.globalFilter) props.dispatch(Action.setGlobalFilter(nextProps.globalFilter));

    if (!isEqual(nextProps.frozenColumns, props.frozenColumns)) {
      props.dispatch(Action.setFrozenColumns(nextProps.frozenColumns));
    }
    if (!isEqual(nextProps.hiddenColumns, props.hiddenColumns)) {
      props.dispatch(Action.setHiddenColumns(nextProps.hiddenColumns));
    }
    if (nextProps.changedContainerDimensions && props.changedContainerDimensions) {
      props.dispatch(Action.onScrollContainerChangedDimensions(nextProps.changedContainerDimensions));
    }
    if (nextProps.currentPage !== props.currentPage) {
      props.dispatch(Action.setCurrentPage(nextProps.currentPage));
    }
    if (!isEqual(props.selectedRowIDs, nextProps.selectedRowIDs)) {
      props.dispatch(Action.setSelectedRowIDs(props.selectedRowIDs));
    }
    if (!isEqual(props.expandedRowIDs, nextProps.expandedRowIDs)) {
      props.dispatch(Action.setExpandedRowIDs(props.expandedRowIDs));
    }
  }
}

const settings = (props: AppProps): SettingState => {
  return ({
    renderData: props.renderData,
    rowExpansionTemplate: props.rowExpansionTemplate,
    resizeableColumns: props.resizeableColumns,
    fixedTableWidth: props.fixedTableWidth,
    reorderableColumns: props.reorderableColumns,
    allowXScrollbar: props.allowXScrollbar,
    allowYScrollbar: props.allowYScrollbar,
    calculateItemsPerPage: props.calculateItemsPerPage,
    selectableRows: props.selectableRows,
    allowExport: props.allowExport,
    alterContextMenu: props.alterContextMenu,
    allowVirtualYScrolling: props.allowVirtualYScrolling,
  });
};

export default App;
