/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { cx } from 'react-emotion';
import { ExtendedColumnDef, ColumnGroupType, GridViewClassNames } from './GridViewMain';
import Expander from './Expander';
import RowExpansion from './RowExpansion';
import RowItem from './RowItem';
import * as Reducer from '../reducer/reducer';
import { onRowClick, onExpanderChanged } from '../reducer/actions';
// import { shallowDiffersWithLog } from '../utils';

export interface RowConnectedProps {
  allowVirtualYScrolling: boolean;
}

export interface RowProps extends RowOwnProps, RowConnectedProps {
  dispatch: (action: any) => void;
}

export interface RowOwnProps {
  columnGroupType: ColumnGroupType;
  item: any;
  defs: ExtendedColumnDef[];
  columnStyles: React.CSSProperties[];
  renderData: any;
  classNameObject: GridViewClassNames;
  onContextMenu: (e: React.MouseEvent<HTMLSpanElement>, columnIndex: number, rowID: string) => void;
  columnReordering: boolean;
  selectedRowIDs: string[];
  reorderColumnIndex: number;
  showRowExpansion: boolean;
  rowExpansionTemplate: (items: any, columnGroupType: ColumnGroupType) => JSX.Element;
  hasExpander: boolean;
  scrollableTablePart: boolean;
  rowIDKey: (item: any) => any;
  rowExpansionRef?: (rowExpansionRef: HTMLDivElement) => void;
}

const select = (state: Reducer.GridViewState, ownProps: RowOwnProps): RowConnectedProps => {
  return {
    allowVirtualYScrolling: Reducer.getAllowVirtualYScrolling(state),
  };
};


export class Row extends React.Component<RowProps, {}> {

  constructor(props: RowProps) {
    super(props);
  }

  public render() {
    const props = this.props;
    const rowID = props.rowIDKey(props.item);
    const items: JSX.Element[] = [];

    if (props.hasExpander && props.defs.length) {
      items.push((
        <Expander
          key={'Expander'}
          onClick={e => this.onClickExpander(rowID, e)}
          isRowExpansionVisible={props.showRowExpansion}
          expanderClassname={props.classNameObject.rowExtender}
        />
      ));
    }

    props.defs.forEach((def) => {
      const style = props.columnStyles[def.columnIndex];
      const shouldRenderItem = !(props.reorderColumnIndex === def.columnIndex
        && props.columnGroupType !== ColumnGroupType.Dummy
        && props.columnReordering);

      if (shouldRenderItem) {
        const showNoReorderIndicator = props.columnReordering ? def.noReordering : false;

        // if (def.viewPermission && ql.hasPermission(this.props.userPermissions, def.viewPermission) === false) return;

        const content = def.renderItem
          ? def.renderItem(props.item, def.columnIndex, props.renderData)
          : def.key(props.item);
        items.push(
          <RowItem
            key={def.columnIndex}
            content={content}
            onContextMenu={(e: React.MouseEvent<HTMLSpanElement>) =>
              props.onContextMenu(e, def.columnIndex, rowID)}
            showNoReorderIndicator={showNoReorderIndicator}
            classNameObject={props.classNameObject}
            style={style}
          />,
        );
      } else {
        items.push((
          <span key={def.columnIndex}
            className={props.classNameObject.reorderGridItem}
            style={style}
          />
        ));
      }
    });

    const isSelectedRow = props.selectedRowIDs.indexOf(rowID) !== -1;

    return props.showRowExpansion && props.defs.length > 0 && props.rowExpansionTemplate
      ? (
        <div
          className={cx(
            props.classNameObject.expandableRow,
            !props.scrollableTablePart && props.classNameObject.frozen,
            isSelectedRow && props.classNameObject.selected,
            !props.scrollableTablePart && isSelectedRow && props.classNameObject.selectedFrozen,
          )}
          style={{ flexDirection: 'column' }}
          onClick={e => this.onRowClick(e, rowID)}
        >
          <div
            key={rowID}
            className={props.classNameObject.row}
          >
            {items}
          </div>
          <RowExpansion
            items={props.item}
            rowExpansionClassname={props.classNameObject.expandedRow}
            columnGroupType={props.columnGroupType}
            rowExpansionTemplate={props.rowExpansionTemplate}
            rowExpansionRef={props.rowExpansionRef}
          />
        </div>
      )
      : (
        <div
          className={cx(
            props.classNameObject.expandableRow,
            !props.scrollableTablePart && props.classNameObject.frozen,
            isSelectedRow && props.classNameObject.selected,
            !props.scrollableTablePart && isSelectedRow && props.classNameObject.selectedFrozen,
          )}
          onClick={e => this.onRowClick(e, rowID)}
        >
          {items}
        </div>
      );
  }


  // public shouldComponentUpdate(nextProps: RowProps) {
  //   console.log('RowUpdate: ' + this.props.rowIDKey(this.props.item));
  //   return shallowDiffersWithLog(this.props, nextProps);
  // }

  private onClickExpander = (rowID: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    this.props.dispatch(onExpanderChanged(rowID));
  }

  private onRowClick = (event: React.MouseEvent<HTMLSpanElement>, rowID: string) => {
    if (!event.defaultPrevented) {
      event.preventDefault();
      this.clearSelection();
      this.props.dispatch(onRowClick(event, rowID));
    }
  }

  private clearSelection = () => {
    const sel = window.getSelection();
    sel.removeAllRanges();
  }
}

export default connect(select)(Row);
