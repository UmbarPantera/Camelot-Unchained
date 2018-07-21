/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface ExpanderProps {
  // : string;
  expanderClassname: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  isRowExpansionVisible: boolean;
}

export const Expander = (props: ExpanderProps) => {
  return (
    <div
      className = { props.expanderClassname }
      onClick = {(e: React.MouseEvent<HTMLDivElement>) => props.onClick(e)}
    >
      <i className={ `fa fa-chevron-circle-${props.isRowExpansionVisible ? 'down' : 'right'}` } />
    </div>
  );
};

export default Expander;
