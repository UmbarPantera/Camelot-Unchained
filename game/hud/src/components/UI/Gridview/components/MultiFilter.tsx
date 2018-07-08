/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { cx } from 'react-emotion';
import { Input, client } from '@csegames/camelot-unchained';
import {
  GridViewState, getColumnStyles, getMultiFilter, getShowMultiFilters, getReorderColumn,
  getHasExpander, getColumnReordering,
} from '../reducer/reducer';
import { ExtendedColumnDef, ColumnGroupType, GridViewClassNames } from './GridViewMain';
import { setFilter, onHeaderContextMenu } from '../reducer/actions';


export interface MultiFilterConnectedProps {
  columnStyles: React.CSSProperties[];
  filterArray: string[];
  showMultiFilterFields: boolean;
  hasExpander: boolean;
  reorderColumnIndex: number;
  columnReordering: boolean;
}

export interface MultiFilterOwnProps {
  columnGroupType: ColumnGroupType;
  columnDefs: ExtendedColumnDef[];
  classNameObject: GridViewClassNames;
}

export interface MultiFilterProps extends MultiFilterOwnProps, MultiFilterConnectedProps {
  dispatch: (action: any) => void;
}



const select = (state: GridViewState, ownProps: MultiFilterOwnProps): MultiFilterConnectedProps => {
  return {
    columnStyles: getColumnStyles(state),
    filterArray: getMultiFilter(state),
    showMultiFilterFields: getShowMultiFilters(state),
    reorderColumnIndex: getReorderColumn(state),
    hasExpander: getHasExpander(state, ownProps.columnGroupType),
    columnReordering: getColumnReordering(state),
  };
};

export class MultiFilter extends React.Component<MultiFilterProps, {}> {

  public constructor(props: MultiFilterProps) {
    super(props);
  }

  public render() {
    const props = this.props;
    if (!props.showMultiFilterFields) return null;
    const filterItems: JSX.Element[] = [];

    if (props.hasExpander && props.columnGroupType !== ColumnGroupType.Dummy && props.columnDefs.length) {
      filterItems.push((
        <div key={'Extender'} className={props.classNameObject.rowExtender} />
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
        const filter = def.customFilterElement
          ? def.customFilterElement
          : (
            <Input type='text' key={def.columnIndex.toString()}
              value={props.filterArray[def.columnIndex]}
              styles={{
                input: props.classNameObject.filterInput,
                inputWrapper: props.classNameObject.filterInputWrapper,
              }}
              onFocus={() => client.RequestInputOwnership()}
              onBlur={() => client.ReleaseInputOwnership()}
              onMouseEnter={() => client.RequestInputOwnership()}
              onMouseLeave={() => {
                client.ReleaseInputOwnership();
              }}
              onChange={
                (e: React.FormEvent<HTMLInputElement>) => props.dispatch(setFilter(def.columnIndex, e.currentTarget.value))
              }
            />
          );
        // if (def.viewPermission && ql.hasPermission(this.props.userPermissions, def.viewPermission) === false) return;

        filterItems.push((
          <div
            key={def.columnIndex}
            className={reorderIndicator
              ? cx(props.classNameObject.filterItem, props.classNameObject.noReorder)
              : props.classNameObject.filterItem}
            style={style}
            onContextMenu={e => this.onContextMenu(e, def.columnIndex)}
          >
            {filter}
          </div>
        ));
      } else {
        // if (def.viewPermission && ql.hasPermission(this.props.userPermissions, def.viewPermission) === false) return;

        filterItems.push((
          <div key={def.columnIndex} className={props.classNameObject.reorderFilterItem}
            style={style}
          >
          </div>
        ));
      }
    });
    return (
      <div className={props.classNameObject.filter}>
        {filterItems}
      </div>
    );
  }

  private onContextMenu = (e: React.MouseEvent<HTMLDivElement>, columnIndex: number) => {
    e.preventDefault();
    const isFrozenColumn = this.props.columnGroupType === ColumnGroupType.Frozen;


    this.props.dispatch(
      onHeaderContextMenu(true, e.clientX, e.clientY, columnIndex, 'Header', e.currentTarget, isFrozenColumn),
    );
  }
}



export default connect(select)(MultiFilter);
