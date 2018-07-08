/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { css, cx } from 'react-emotion';
import { RaisedButton, RaisedButtonStyle } from '@csegames/camelot-unchained';
import { GridViewState, getTotalPages, getCurrentPage } from '../reducer/reducer';
import { setCurrentPage } from '../reducer/actions';

export interface PaginatorConnectedProps {
  totalPages: number;
  currentPage: number;
}

export interface PaginatorOwnProps {
  styles: Partial<PaginatorClassnames>;
}

export interface PaginatorProps extends PaginatorOwnProps, PaginatorConnectedProps {
  dispatch: (action: any) => void;
}

export interface PaginatorStyle {
  pagination: React.CSSProperties;
  pageButton: React.CSSProperties;
  raisedButton: RaisedButtonStyle;
}

export interface PaginatorClassnames {
  pagination: string;
  pageButton: string;
  raisedButton: RaisedButtonStyle;
}

const select = (state: GridViewState, ownProps: PaginatorOwnProps): PaginatorConnectedProps => {
  return {
    totalPages: getTotalPages(state),
    currentPage: getCurrentPage(state),
  };
};

export const pageButton = css`
  flex: 0 0 auto;
  font-size: .8em;
`;

export const pagination = css`
  display: flex;
  align-self: center;
  flex: 0 0 auto;
  box-sizing: border-box;
  align-content: center;
  justify-content: center;
`;

export class Paginator extends React.Component<PaginatorProps, {}> {
  constructor(props: PaginatorProps) {
    super(props);
  }

  public render() {
    const props = this.props;
    const raisedButtonStyle = props.styles.raisedButton;
    const page = props.currentPage;
    if (props.totalPages <= 1) {
      return null;
    }

    const pages: JSX.Element[] = [];
    const pageButtonStyle = cx(pageButton, props.styles.pageButton);

    // back to 0 button
    pages.push(
      (
        <RaisedButton key={'back-full'} disabled={page < 1}
          onClick={() => props.dispatch(setCurrentPage(0))}
          styles={raisedButtonStyle}>
          <div className={pageButtonStyle}>
            <i className='fa fa-backward'></i>
          </div>
        </RaisedButton>
      ),
    );

    // back a single page button
    pages.push(
      (
        <RaisedButton key={'back-one'} disabled={page < 1}
          onClick={() => props.dispatch(setCurrentPage(page - 1))}
          styles={raisedButtonStyle}>
          <div className={pageButtonStyle}>
            <i className='fa fa-step-backward'></i>
          </div>
        </RaisedButton>
      ),
    );

    // insert page numbers
    let start = page - 2;
    if (start < 0) start = 0;
    let end = page + 3;
    if (end > props.totalPages) end = props.totalPages;

    for (let i = start; i < end; ++i) {
      // render current page as disabled
      if (i === page) {
        pages.push(
          (
            <RaisedButton key={i} disabled={true}
              styles={raisedButtonStyle}>
              <div className={pageButtonStyle}>
                {i + 1}
              </div>
            </RaisedButton>
          ),
        );
        continue;
      }
      pages.push(
        (
          <RaisedButton key={i} onClick={() => props.dispatch(setCurrentPage(i))}
            styles={raisedButtonStyle}>
            <div className={pageButtonStyle}>
              {i + 1}
            </div>
          </RaisedButton>
        ),
      );
    }

    // forward one page button
    pages.push(
      (
        <RaisedButton key={'forward-one'} disabled={page > props.totalPages - 2}
          onClick={() => props.dispatch(setCurrentPage(page + 1))}
          styles={raisedButtonStyle}>
          <div className={pageButtonStyle}>
            <i className='fa fa-step-forward'></i>
          </div>
        </RaisedButton>
      ),
    );

    // go to last page button
    pages.push(
      (
        <RaisedButton key={'forward-full'} disabled={page > props.totalPages - 2}
          onClick={() => props.dispatch(setCurrentPage(props.totalPages - 1))}
          styles={raisedButtonStyle}>
          <div className={pageButtonStyle}>
            <i className='fa fa-forward'></i>
          </div>
        </RaisedButton>
      ),
    );

    return (
      <div className={cx(pagination, props.styles.pagination)}>
        {pages}
      </div>
    );
  }

  public shouldComponentUpdate(nextProps: PaginatorProps) {
    return !(this.props.currentPage === nextProps.currentPage && this.props.totalPages === nextProps.totalPages);
  }
}

export default connect(select)(Paginator);
