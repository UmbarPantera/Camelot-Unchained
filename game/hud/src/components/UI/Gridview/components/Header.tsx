/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { cx } from 'react-emotion';
import { find, findIndex } from 'lodash';
import { ExtendedColumnDef, GridViewSort, SortInfo, ColumnGroupType, GridViewClassNames } from './GridViewMain';
import * as Reducer from '../reducer/reducer';
import { onHeaderContextMenu, setMultiSort, columnReordering, setReorderColumn } from '../reducer/actions';


export interface HeaderConnectedProps {
  columnStyles: React.CSSProperties[];
  fixedTableWidth: boolean;
  resizeableColumns: boolean;
  multiSort: SortInfo[];
  lastColumnIndex: number;
  reorderColumnIndex: number;
  columnReordering: boolean;
  hasExpander: boolean;
}

export interface HeaderOwnProps {
  columnDefs: ExtendedColumnDef[];
  columnGroupType: ColumnGroupType;
  handleMouseDownResize: (e: React.MouseEvent<HTMLDivElement>, columnIndex: number) => void;
  handleMouseDownReorder: (e: React.MouseEvent<HTMLDivElement>, columnIndex: number) => void;
  columnRef: (columnRef: HTMLDivElement, index: number) => void;
  classNameObject: GridViewClassNames;
}

export interface HeaderProps extends HeaderOwnProps, HeaderConnectedProps {
  dispatch: (action: any) => void;
}

const select = (state: Reducer.GridViewState, ownProps: HeaderOwnProps): Partial<HeaderConnectedProps> => {
  return {
    columnStyles: Reducer.getColumnStyles(state),
    fixedTableWidth: Reducer.getFixedTableWidth(state),
    resizeableColumns: Reducer.getResizeableColumns(state),
    multiSort: Reducer.getMultiSort(state),
    lastColumnIndex: Reducer.getLastColumnIndex(state),
    reorderColumnIndex: Reducer.getReorderColumn(state),
    columnReordering: Reducer.getColumnReordering(state),
    hasExpander: Reducer.getHasExpander(state, ownProps.columnGroupType),
  };
};

export class Header extends React.Component<HeaderProps, {}> {
  private reorderTimer: any;
  private triggerSort: boolean = false;

  constructor(props: HeaderProps) {
    super(props);
  }

  public render() {
    const props = this.props;
    const headerItems: JSX.Element[] = [];
    if (props.hasExpander && props.columnGroupType !== ColumnGroupType.Dummy && props.columnDefs.length) {
      headerItems.push((
        <div key={'Extender'} className={props.classNameObject.rowExtender}/>
      ));
    }
    props.columnDefs.forEach((def) => {
      const style = props.columnStyles[def.columnIndex];
      const reorderIndicator = props.columnReordering ? def.noReordering : false;
      if (
        (props.reorderColumnIndex !== def.columnIndex)
        || props.columnGroupType === ColumnGroupType.Dummy
        || !props.columnReordering
      ) {
        const sorted = this.getSortInfo(def.columnIndex);
        let resizer = props.resizeableColumns && (
          <div
            className={props.classNameObject.columnResizer}
            onMouseDown={event => props.handleMouseDownResize(event, def.columnIndex)}
          >
          </div>
        );

        // no resizer for the last column, if we want a fixed table width
        if (def.columnIndex === props.lastColumnIndex && props.fixedTableWidth) resizer = null;

        // if (def.viewPermission && ql.hasPermission(this.props.userPermissions, def.viewPermission) === false) return;
        const content = def.headerTemplate ? def.headerTemplate(def.title, def.columnIndex) : def.title;

        headerItems.push((
          <div key={def.columnIndex} className={reorderIndicator
            ? cx(props.classNameObject.headerItem, props.classNameObject.noReorder)
            : props.classNameObject.headerItem}
            style={style}
            onContextMenu={e => this.onContextMenu(e, def.columnIndex)}
            onMouseDown={event => this.handleMouseDown(event, def)}
            onMouseUp={event => this.handleMouseUp(event, def)}
            ref={(r) => { if (props.columnGroupType !== ColumnGroupType.Dummy) props.columnRef(r, def.columnIndex); }}
          >
            <div className={props.classNameObject.headerElements}>
              <span key={def.columnIndex} className={props.classNameObject.headerName}>
                {content}&nbsp;
          </span>
              {
                sorted === GridViewSort.None ? null :
                  <i className={`fa fa-caret-${sorted === GridViewSort.Up ? 'down' : 'up'}`}>
                    <span className={props.classNameObject.sortPrio}>
                      {this.getPrio(def.columnIndex)}
                    </span>
                  </i>
              }
            </div>
            {resizer}
          </div>
        ));
      } else {
        headerItems.push((
          <div
            key={def.columnIndex}
            className={props.classNameObject.reorderHeaderItem}
            style={style}
            ref={(r) => { if (props.columnGroupType !== ColumnGroupType.Dummy) props.columnRef(r, def.columnIndex); }}
          >
          </div>
        ));
      }
    });
    return (
      <div className={props.classNameObject.header}>
        {headerItems}
      </div>
    );
  }

  public componentWillUnmount() {
    clearTimeout(this.reorderTimer);
  }

  private getSortInfo = (index: number): GridViewSort => {
    if (this.props.multiSort !== []) {
      let sortInfo = find(this.props.multiSort, obj => (obj.index === index));
      if (sortInfo === undefined) sortInfo = { index: -1, sorted: GridViewSort.None };
      return sortInfo.sorted;
    }
    return GridViewSort.None;
  }

  private getPrio = (index: number): number => {
    // if there is only one element we need no priority indicator
    if (this.props.multiSort.length < 2) return null;
    let prio: number = findIndex(this.props.multiSort, obj => (obj.index === index));
    (prio === -1) ? prio = null : prio++;
    return prio;
  }

  private handleMouseUp = (event: React.MouseEvent<HTMLDivElement>, columnDef: ExtendedColumnDef) => {
    if (this.triggerSort) {
      this.triggerSort = false;
      clearTimeout(this.reorderTimer);
      if (!columnDef.notSortable) {
        switch (this.getSortInfo(columnDef.columnIndex)) {
          case GridViewSort.None:
          case GridViewSort.Down:
            this.setSort(columnDef.columnIndex, GridViewSort.Up);
            return;
          case GridViewSort.Up:
            this.setSort(columnDef.columnIndex, GridViewSort.Down);
            return;
        }
      } else {
        alert('Column is not sortable'); // better way for an error message needed?
      }
    }
  }

  private handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, columnDef: ExtendedColumnDef) => {
    event.persist();
    if (event.button === 0) {
      this.triggerSort = true;
      if (!columnDef.noReordering) {
        this.reorderTimer = setTimeout(() => {
          this.triggerSort = false;
          this.props.handleMouseDownReorder(event, columnDef.columnIndex);
        }, 150);
      } else {
        // if we try to reorder a column, that is not reorderable, we enable reordering for a second so the
        // noReorderIndicator shows up on this column to make it obvious, that you can't reorder this column. After that we
        // disable reordering automatically.
        this.reorderTimer = setTimeout(() => {
          this.triggerSort = false;
          this.columnNotReorderable();
        }, 250);
        this.props.dispatch(setReorderColumn(null));
      }
    }
  }

  private columnNotReorderable = () => {
    this.props.dispatch(columnReordering(true));
    this.reorderTimer = setTimeout(() => {
      this.props.dispatch(columnReordering(false));
    }, 1000);
  }

  private setSort = (index: number, sortBy: GridViewSort) => {
    let replaceSort: boolean = false;
    let nextMultiSort: SortInfo[] = [];
    if (this.props.multiSort !== []) {
      nextMultiSort = this.props.multiSort.map((obj: SortInfo) => {
        if (obj.index === index) replaceSort = true;
        return (obj.index === index) ? { index: obj.index, sorted: sortBy } : { ...obj };
      });
    }
    if (!replaceSort) nextMultiSort.push({ index, sorted: sortBy });
    this.props.dispatch(setMultiSort(nextMultiSort));
  }

  private onContextMenu = (e: React.MouseEvent<HTMLDivElement>, columnIndex: number) => {
    e.preventDefault();
    const isSorted = (): boolean => {
      const allSortedColumns = this.props.multiSort.map(sortInfo => sortInfo.index);
      if (allSortedColumns.indexOf(columnIndex) !== -1) return true;
      return false;
    };
    const isFrozenColumn = this.props.columnGroupType === ColumnGroupType.Frozen;


    this.props.dispatch(
      onHeaderContextMenu(true, e.clientX, e.clientY, columnIndex, 'Header', e.currentTarget, isFrozenColumn, isSorted()),
    );
  }
}

export default connect(select)(Header);
