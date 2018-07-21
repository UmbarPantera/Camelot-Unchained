# GridView 2

A javascript table, based on React and Redux.

---
## Basic Setup

There is a minimum needed to get started

* Import the main file
* Define columns:
  Each column just needs a key, which is a functions, that returns the value the column should show. If you don't provide a title
  a title is created using the end of your key function
* set visiblity (also the table needs to know, if it is visible)

```js
import GridView from '../../UI/Gridview';

const columnDefs = [
  {
    key: (m: TeamPlayer) => m.displayName, // title will be displayName
  },
  {
    key: (m: TeamPlayer) => m.damage.killCount.playerCharacter,
    title: 'Kills',
  },
];

render () {
  return (
    <GridView
      columnDefs={this.columnDefs}
      inputData={teamplayers: TeamPlayer[]}
      visible={isTableVisible}
    />
  );
}
```

---
## Advanced Setup

### Via Props

You can setup the table using props only. They will be transformed into actions to modifiy the redux store.


#### Only for inital setup:

#### `columnDefs: ColumnDefinition[];`

#### `styles?: Partial<GridViewStyle>;`
Custom styles

#### `allowXScrollbar?: boolean = true;`
Allow scrolling in x direction


#### `allowYScrollbar?: boolean = true;`
allow scrolling in y direction

#### `itemsPerPage?: number = 20;`
Tell the paginator how many items should be displayed on one page

#### `rowIDKey?: (item: any) => any;`
Table needs an unique identifier for each row of data. If the data already has an unique value you can use this one.
In this case you can use this function to tell the table, how to get this value. If no key is provided it will
be created internally

#### `resizeableColumns?: boolean = false;`
Are columns resizeable

#### `fixedTableWidth?: boolean = false;`
Can resizing a column increase or decrease the table width or will increasing the size of one column just make anotherone smaller?

#### `reorderableColumns?: boolean = false;`
Can you reorder Columns

#### `selectableRows?: boolean = true;`
Can the user select rows?

#### `calculateItemsPerPage?: boolean = false;`
Calculate the number of rows of data, that fit on a page and set up a paginator, if needed

#### `alterContextMenu?: (contextMenuInfo: AlterContextMenu) => ContextMenuItem[];`
Function to get and change the content of the context menu

#### `rowExpansionTemplate?: (items: any, columnGroupType: ColumnGroupType) => JSX.Element;`
Template for a row expansion. If a function is provided each row will get an arrow to expand it.
Frozen columns and scrollable columns will both get the same expansion, if you do not create a different one
for each using the columnGroupType

#### `allowVirtualYScrolling?: boolean = true;`
To disable virtualYScrolling. If virtual y scrolling is active expanding a single scrollable row is no longer possible.
By disabling virtual scrolling you can expand single scrollable rows again. 

#### `renderData?: {[id: string]: any};`

#### `allowExport?: boolean = false;`
Adds two options to the context menu to export the table


#### Modifications

#### `visible: boolean = false;`

#### `inputData?: any;`

#### `frozenColumns?: number[];`
Set frozen column(s). The number is the one needed to access the column in the columnDefs array

#### `hiddenColumns?: number[];`
Hide column(s). The number is the one needed to access the column in the columnDefs array

#### `globalFilter?: string;`
You need to create an input field for it.

#### `showMultiFilters?: boolean = true;`
Show a filter field for each column below the header

#### `filterArray?: string[];`
filterArray.length needs to be the same as columnDefinition.length. Use '' for empty filter

#### `multiSort?: SortInfo[];`

#### `frozenRowIDs?: string[];`
Needs the ID string of a row of data

#### `selectedRowIDs?: string[];`
Needs the ID string of a row of data

#### `expandedRowIDs?: string[];`
Needs the ID string of a row of data

#### `currentPage?: number;`

#### `changedContainerDimensions?: boolean = false;`
if the space available for the table has changed, but this was not caused by resizing the window, GridView does not know
about this change and we have to inform it by setting changedContainerDimensions to true. Otherwise the number of items
per page possible (needed for y- scrollbar and if you calculate the itemsPerPage) and the width available for
x-scrolling are not recalculated, which means the scrollbars won't work correctly or we get an hidden overflow


### Redux

#### `getStore?: (store: Store<GridViewState>) => void;`
Use this function to get the store
```js
render () {
  return (
    <GridView
      columnDefs={this.columnDefs}
      visible={isTableVisible}
      getStore={this.getGridViewStore}
    />
  );
}

private getGridViewStore = (store: Store<GridViewState>) => {
    // do with the store whatever you like
  }
```

#### `getter`
import from definitions file
```js
import {  } from './Gridview/definitions';
```

#### `actions`
import from definitions file

---
## Limitations

* if you allow virtual y scrolling, scrollable rows cannot be expanded seperatly. It turns into a all or nothing thing as we need the same height for each row. Otherwise the calculations for virtual scrolling wuld become very complicated (and slow)
* You need to enable y-scrolling, if you want to expand rows / use a row expansion template. Otherwise expanding rows will push other rows off view.
* auto creation of column titels uses the provided key from the definition.  It simply uses the last part of the function behind the last ".". So if the key is something like (m: { name: number }) => m.name the title will be "name". If the key looks different it won't work properly and you have to manually set a titel.

---
## Nice To Know

### Sorting
sorting strings and numbers is done in a different way. The type of the used variable determines which one is used

### ColumnDefinitions:
minWidth needs to be defined in px ('100px' or 100 are both ok)

### Styles:
be careful, if you change borders and paddings. If header, filter and grid items are not matching (same for their reorder parts), the table won't be an exact table anymore


---
## License

The code is licensed under the Mozilla Public License, version 2.0:

> https://www.mozilla.org/MPL/2.0/



