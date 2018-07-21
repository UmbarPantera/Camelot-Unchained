/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ExtendedColumnDef } from '../../components/GridViewMain';
// import columnDef from './columnDef';
import { ActionTypeKeys, ActionTypes }  from '../actions';

export const columnDefs = (s: ExtendedColumnDef[] = [], a: ActionTypes): ExtendedColumnDef[] => {
  switch (a.type) {
    case ActionTypeKeys.IMPORT_COLUMN_DEFS: {
      return a.columnDefs.map(def => def.title ? def : { ...def, title: createTitel(def) });
    }
    default: return s;
  }
};

const createTitel = (def: ExtendedColumnDef): string => {
  const text = def.key.toString();
  return text.slice(text.lastIndexOf('.') + 1, text.length).toUpperCase();
};

export default columnDefs;
