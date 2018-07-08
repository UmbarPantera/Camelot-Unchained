/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { cx } from 'react-emotion';
import { GridViewClassNames } from './GridViewMain';

export interface RowItemProps {
  style: React.CSSProperties;
  classNameObject: GridViewClassNames;
  onContextMenu: (e: React.MouseEvent<HTMLSpanElement>) => void;
  showNoReorderIndicator: boolean;
  content: JSX.Element;
}

export const RowItem = (props: RowItemProps) => {
  return (
    <span
      className={cx(
        props.classNameObject ? props.classNameObject.gridItem : props.classNameObject.reorderGridItem,
        props.showNoReorderIndicator && props.classNameObject.noReorder,
      )}
      style={props.style}
      onContextMenu={(e: React.MouseEvent<HTMLSpanElement>) =>
        props.onContextMenu(e)}
    >
      {props.content}
    </span>
  );
};

export default RowItem;
