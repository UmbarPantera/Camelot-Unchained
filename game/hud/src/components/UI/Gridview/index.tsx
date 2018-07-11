/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';
import reducer from './reducer/reducer';
import App, { AppProps } from './components/App';

const store = createStore(reducer, applyMiddleware(thunk)); // , logger));

export const GridViewTable = (props: AppProps) => {
  if (props.getStore) props.getStore(store);
  return (
    <Provider store={store}>
      <App
        {...props}
        dispatch={store.dispatch}
      />
    </Provider>
  );
};

export default GridViewTable;
