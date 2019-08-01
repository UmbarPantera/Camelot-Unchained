# Infinite DropDownMenu

In infinite drop down menu with corresponding checkboxes

---
## Basic Setup

```js
import DropDownMenu, { MenuDef } from './DropDownMenu';

const yourMenuDefs: MenuDef[] = [
  {
    label: 'Menu1',
    items: [
      {
        label: 'SubMenu1',
        items: [
          { label: 'Element 1 of SubMenu 1' },
          { label: 'Element 2 of SubMenu 1'},
        ],
      },
      { label: 'Element of Menu 1' }
    ],
  },
  {
    label: 'Element in the menu bar',
  },
];

render () {
  return (
    <DropDownMenu
     defs={yourMenuDefs}
   />
  );
}

```

## Props

#### defs: MenuDef[]
only used for the initial state of the menu
##### label: string
The text shown for the element
##### items?: MenuDef[]
the elements in its menu
##### selected?: boolean
is its checkbox selected/unselected
<br />
<br />

#### customStyles?: Partial`<DropDownMenuCustomStyles>`
custom Styles for different parts of the menu
<br />
<br />

#### showCheckBox?: boolean
show the checkboxes
If there are no checkboxes, its just a normal infinite menu.
If this value is set to false/undefined the count is hidden as well
<br />
<br />

#### showCount?: boolean
if this valule is true, a number is displayed next to each element which indicates, how many of its children, that have no subitems/submenu, are selected
<br />
<br />

#### selectedItems?: string[];
Only used for the initial state of the menu.
If the label, the id or one of the tags of a menu element matches a string in the array, the menu element will be selected.
You can use this to select menu elements without changing the menu def.
<br />
<br />

#### renderCheckBox: (checked: boolean) => JSX.Element;
renders a custom checkbox inside the custom checkbox container

#### getSelectedDefs?: (defs: MenuDef[]) => void
is called each time the menu def change / the selection of a menu element changes. 
You get the defs of all elements, that have no subitems/submenu, that are selected
<br />
<br />

#### getMenuState?: (menuState: MenuDef[]) => void
is called, when the menu state changes
Returns they next menu state
<br />
<br />

#### onMenuClick?: (def: MenuDef) => void
is called on each click on a menu element
you get the def of the element
<br />
<br />

#### onSelectChange?: (def: MenuDef) => void;
is called each time a checkbox changes
you get the new def for the element, the checkbox is belonging to
