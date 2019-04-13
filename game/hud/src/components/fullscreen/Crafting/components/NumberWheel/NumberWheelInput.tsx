/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { debounce } from 'lodash';
import { css } from '@csegames/linaria';
import { TextInput } from 'shared/TextInput';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const InputStyle = css`
  width: 50px;
  height: 40px;
  font-size: 22px !important;
  color: #91FFFF !important;
  background-color: transparent !important;
  font-family: Caudex !important;
  border: 0px;
  text-align: center;
  pointer-events: all;
  margin-top: 5px !important;
  overflow: visible;
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 120px;
    height: 120px;
    font-size: 44px !important;
  }
`;

export interface Props {
  value: number;
  minValue: number;
  maxValue: number;
  onChange: (newVal: number) => void;

  // These are for display only
  // Text to add before the value in the input
  prevValueDecorator?: string;
  trailValueDecorator?: string;
}

export interface State {
  tempValue: number;
}

class NumberWheelInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tempValue: props.value,
    };
    this.onChange = debounce(this.onChange, 500);
  }

  public render() {
    return (
      <TextInput
        type='text'
        overrideInputStyles
        inputClassName={InputStyle}
        value={`${this.props.prevValueDecorator || ''}${this.state.tempValue}${this.props.trailValueDecorator || ''}`}
        onChange={this.onInputChange}
      />
    );
  }

  public componentDidUpdate(prevProps: Props) {
    // Debounced prop value has updated, check to make sure local state and prop are in sync.
    if (prevProps.value !== this.props.value && this.props.value !== this.state.tempValue) {
      this.setState({ tempValue: this.props.value });
    }
  }

  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const start = this.props.prevValueDecorator ? this.props.prevValueDecorator.length : 0;
    const end = this.props.trailValueDecorator
      ? - this.props.trailValueDecorator.length
      : e.target.value.length;
    const newVal = Number(e.target.value.slice(start, end));
    this.setState({ tempValue: newVal });
    this.onChange(newVal);
  }

  private onChange = (newVal: number) => {
    if (newVal <= this.props.maxValue && newVal >= this.props.minValue) {
      this.props.onChange(newVal);
    } else {
      this.setState({ tempValue: this.props.value });
    }
  }
}

export default NumberWheelInput;
