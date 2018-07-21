/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ColumnGroupType } from './GridViewMain';

export interface RowExpansionProps {
  columnGroupType: ColumnGroupType;
  items: any;
  rowExpansionClassname: string;
  rowExpansionTemplate: (items: any, columnGroupType: ColumnGroupType) => JSX.Element;
  rowExpansionRef: (rowExpansionRef: HTMLDivElement) => void;
}

export const RowExpansion = (props: RowExpansionProps) => {
  if (this.props.columnGroupType === ColumnGroupType.Dummy) return null;
  return (
    <div
      className={props.rowExpansionClassname}
      ref={(r) => { if (props.rowExpansionRef) props.rowExpansionRef(r); }}
    >
      {props.rowExpansionTemplate(props.items, props.columnGroupType)}
    </div>
  );
};

export default RowExpansion;
