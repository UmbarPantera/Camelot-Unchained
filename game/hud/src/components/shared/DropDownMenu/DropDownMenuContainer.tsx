/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MenuDef, DropDownMenuCustomStyles } from '../DropDownMenu';
import DropDownMenuElement from './DropDownMenuElement';


export interface MenuContainerProps {
  top: number;
  left: number;
}

const Container = styled.div<MenuContainerProps & React.HTMLAttributes<HTMLDivElement>>`
  position: absolute;
  display: flex;
  top: ${(props: MenuContainerProps) => props.top}px;
  left: ${(props: MenuContainerProps) => props.left}px;
  flex-direction: column;
  background-color: #18130E;
  border: 1px solid #413735;
  box-sizing: border-box;
`;

export interface Props {
  defs: MenuDef[];
  renderCheckBox: (checked: boolean) => JSX.Element;
  onMenuClick: (def: MenuDef) => void;
  positionLeft: number;
  positionTop: number;
  onMouseDownHide: () => void;
  update: (defs: MenuDef[]) => void;
  onSelectChange: (def: MenuDef) => void;
  showCheckBox: boolean;
  showCount: boolean;
  customStyles: Partial<DropDownMenuCustomStyles>;
}

// tslint:disable-next-line:function-name
export function DropDownMenuContainer(props: Props): JSX.Element {

  React.useEffect(() => {
    window.addEventListener('mousedown', props.onMouseDownHide);

    return function cleanup() {
      window.removeEventListener('mousedown', props.onMouseDownHide);
    };
  }, []);

  function update(index: number) {
    return function(def: MenuDef) {
      const nextDefs = [
        ...props.defs.slice(0, index),
        def,
        ...props.defs.slice(index + 1),
      ];
      props.update(nextDefs);
    };
  }

  return (
    <Container
      className={props.customStyles && props.customStyles.menuContainer}
      top={props.positionTop}
      left={props.positionLeft}
    >
      {props.defs.map((def, index) => {
        return (
          <DropDownMenuElement
            key={def.label}
            def={def}
            renderCheckBox={props.renderCheckBox}
            update={update(index)}
            onMenuClick={props.onMenuClick}
            onSelectChange={props.onSelectChange}
            showCheckBox={props.showCheckBox}
            showCount={props.showCount}
            customStyles={props.customStyles}
          />
        );
      })}
    </Container>
  );
}

export default DropDownMenuContainer;
