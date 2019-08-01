/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import DropDownMenuElement, { MenuElementCustomStyles } from './DropDownMenuElement';


const Container = styled.div`
  max-width: fit-content;
  min-width: fit-content;
  box-sizing: border-box;
  display: flex;
`;

export interface MenuDef {
  label: string;
  id?: string;
  tags?: string[];
  selected?: boolean;
  items?: MenuDef[];
}

export interface DropDownMenuCustomStyles {
  menuBar: string;
  menuElement: Partial<MenuElementCustomStyles>;
  menuContainer: string;
}

export interface Props {
  defs: MenuDef[];
  renderCheckBox?: (checked: boolean) => JSX.Element;
  onMenuClick?: (def: MenuDef) => void;
  selectedItems?: string[];
  onSelectChange?: (def: MenuDef) => void;
  getSelectedDefs?: (defs: MenuDef[]) => void;
  getMenuState?: (menuState: MenuDef[]) => void;
  showCheckBox?: boolean;
  showCount?: boolean;
  customStyles?: Partial<DropDownMenuCustomStyles>;
}

// tslint:disable-next-line:function-name
export function DropDownMenu(props: Props) {
  const [menuState, setMenuState] = React.useState(() => initMenu());

  // find out, which items at the bottom of the whole menu tree are checked
  React.useEffect(() => {
    if (props.getSelectedDefs) {
      const selectedDefs: MenuDef[] = [];
      function collectSelectedDefs(def: MenuDef) {
        if (!!def.items && !!def.items.length) {
          def.items.forEach(item => collectSelectedDefs(item));
          return;
        }
        if (def.selected) selectedDefs.push(def);
      }
      menuState.forEach(def => collectSelectedDefs(def));
      props.getSelectedDefs(selectedDefs);
    }
  }, [menuState]);

  // create initial Menu state. Use props.selectedItems to start with different selected items
  // without changing the whole menu defs
  function initMenu() {
    if (props.showCheckBox) {
      return props.defs.map(def => createMenuItem(def, def.selected || false));
    }
    return props.defs;
  }

  function createMenuItem(def: MenuDef, topLevelSelected: boolean): MenuDef {
    const tags = def.tags ? [def.label, ...def.tags] : [def.label];
    const identifiers = def.id ? [...tags, def.id] : tags;
    const selected = topLevelSelected
      ? true
      : def.selected
        ? def.selected
        : props.selectedItems
          ? !!identifiers.filter(identifier => props.selectedItems.indexOf(identifier) !== -1).length
          : false;
    return ({
      ...def,
      selected,
      items: !!def.items ? def.items.map(def => createMenuItem(def, selected)) : [],
    });
  }

  // create update function for each element in the menu bar to update the correct part of the menuState
  function updateMenuState(index: number) {
    return function(def: MenuDef) {
      setMenuState((prevState) => {
        const nextMenuState = [
          ...prevState.slice(0, index),
          def,
          ...prevState.slice(index + 1),
        ];
        if (props.getMenuState) {
          props.getMenuState(nextMenuState);
        }
        return nextMenuState;
      });
    };
  }

  return (
    <Container className={props.customStyles && props.customStyles.menuBar}>
      {menuState.map((def, index) => (
        <DropDownMenuElement
          key={def.label}
          def={def}
          renderCheckBox={props.renderCheckBox}
          onMenuClick={props.onMenuClick}
          onSelectChange={props.onSelectChange}
          update={updateMenuState(index)}
          isMenuBarElement={true}
          showCheckBox={props.showCheckBox}
          showCount={props.showCount}
          customStyles={props.customStyles}
        />
      ))}
    </Container>
  );
}

export default DropDownMenu;
