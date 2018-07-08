/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// import { ExtendedColumnDef } from '../components/App';
import { ActionTypes }  from '../actions';


export const allRowIDs = (s: string[] = [], a: ActionTypes): string[] => {
  switch (a.type) {
    default: return s;
  }
};

export default allRowIDs;
